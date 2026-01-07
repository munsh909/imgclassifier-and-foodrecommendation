import os
import logging
from typing import Dict, List, Any
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import torchvision.models as models
import torch.nn as nn
import torch
import torchvision.transforms as transforms
import io
import joblib
from sklearn.preprocessing import LabelEncoder  
from recommend import recommend_similar_items
from contextlib import asynccontextmanager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

image_label_encoder = None
image_classifier_model = None

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_CLASSIFIER_MODEL_PATH = os.path.join(BASE_DIR, "Models", "Image Classifier", "food101_model.pth")
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, "Models", "Image Classifier", "label_encoder.pkl")

MAX_IMAGE_SIZE = 10 * 1024 * 1024  
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}

def validate_file(file: UploadFile) -> None:
    """Validate uploaded file type and size."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_IMAGE_TYPES)}"
        )
    
    if hasattr(file, 'size') and file.size and file.size > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size: {MAX_IMAGE_SIZE / (1024*1024):.1f}MB"
        )

def load_model() -> torch.nn.Module:
    """Load and initialize the image classification model."""
    try:
        weights = models.DenseNet121_Weights.IMAGENET1K_V1
        model = models.densenet121(weights=weights)
        
        num_features = model.classifier.in_features
        model.classifier = nn.Linear(num_features, 101)
        
        if not os.path.exists(IMAGE_CLASSIFIER_MODEL_PATH):
            raise FileNotFoundError(f"Model file not found: {IMAGE_CLASSIFIER_MODEL_PATH}")
        
        state_dict = torch.load(IMAGE_CLASSIFIER_MODEL_PATH, map_location=torch.device("cpu"))
        model.load_state_dict(state_dict)
        model.eval()
        
        logger.info("Image classifier model loaded successfully")
        return model
        
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

def get_image_transform() -> transforms.Compose:
    """Get image preprocessing transformation."""
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]) 
    ])

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for loading models."""
    global image_label_encoder, image_classifier_model
    
    try:
        if not os.path.exists(LABEL_ENCODER_PATH):
            raise FileNotFoundError(f"Label encoder not found: {LABEL_ENCODER_PATH}")
        
        try:
            image_label_encoder = joblib.load(LABEL_ENCODER_PATH)
            logger.info("Label encoder loaded successfully with joblib")
        except Exception as joblib_error:
            logger.warning(f"joblib loading failed: {joblib_error}")
            try:
                import pickle
                with open(LABEL_ENCODER_PATH, 'rb') as f:
                    image_label_encoder = pickle.load(f)
                logger.info("Label encoder loaded successfully with pickle")
            except Exception as pickle_error:
                logger.error(f"Both joblib and pickle loading failed: {pickle_error}")
                logger.warning("Creating new label encoder with Food101 classes")
                food101_classes = [
                    'apple_pie', 'baby_back_ribs', 'baklava', 'beef_carpaccio', 'beef_tartare',
                    'beet_salad', 'beignets', 'bibimbap', 'bread_pudding', 'breakfast_burrito',
                    'bruschetta', 'caesar_salad', 'cannoli', 'caprese_salad', 'carrot_cake',
                    'ceviche', 'cheesecake', 'cheese_plate', 'chicken_curry', 'chicken_quesadilla',
                    'chicken_wings', 'chocolate_cake', 'chocolate_mousse', 'churros', 'clam_chowder',
                    'club_sandwich', 'crab_cakes', 'creme_brulee', 'croque_madame', 'cup_cakes',
                    'deviled_eggs', 'donuts', 'dumplings', 'edamame', 'eggs_benedict',
                    'escargots', 'falafel', 'filet_mignon', 'fish_and_chips', 'foie_gras',
                    'french_fries', 'french_onion_soup', 'french_toast', 'fried_calamari', 'fried_rice',
                    'frozen_yogurt', 'garlic_bread', 'gnocchi', 'greek_salad', 'grilled_cheese_sandwich',
                    'grilled_salmon', 'guacamole', 'gyoza', 'hamburger', 'hot_and_sour_soup',
                    'hot_dog', 'huevos_rancheros', 'hummus', 'ice_cream', 'lasagna',
                    'lobster_bisque', 'lobster_roll_sandwich', 'macaroni_and_cheese', 'macarons', 'miso_soup',
                    'mussels', 'nachos', 'omelette', 'onion_rings', 'oysters',
                    'pad_thai', 'paella', 'pancakes', 'panna_cotta', 'peking_duck',
                    'pho', 'pizza', 'pork_chop', 'poutine', 'prime_rib',
                    'pulled_pork_sandwich', 'ramen', 'ravioli', 'red_velvet_cake', 'risotto',
                    'samosa', 'sashimi', 'scallops', 'seaweed_salad', 'shrimp_and_grits',
                    'spaghetti_bolognese', 'spaghetti_carbonara', 'spring_rolls', 'steak', 'strawberry_shortcake',
                    'sushi', 'tacos', 'takoyaki', 'tiramisu', 'tuna_tartare', 'waffles'
                ]
                image_label_encoder = LabelEncoder()
                image_label_encoder.fit(food101_classes)
                logger.info("Created new label encoder with Food101 classes")
        
        image_classifier_model = load_model()
        
        logger.info("All models loaded successfully")
        
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")
        raise
    
    yield
    
    logger.info("Application shutting down")

app = FastAPI(
    title="Food Image Classifier API",
    description="API for classifying food images using DenseNet121 trained on Food101 dataset",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code}
    )

@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint to check if the API is running."""
    return {"message": "Food Image Classifier API is running", "status": "healthy"}

@app.get("/health", response_model=Dict[str, str])
async def health_check():
    """Health check endpoint."""
    model_loaded = image_classifier_model is not None
    encoder_loaded = image_label_encoder is not None
    
    return {
        "status": "healthy" if model_loaded and encoder_loaded else "unhealthy",
        "model_loaded": str(model_loaded),
        "encoder_loaded": str(encoder_loaded)
    }

@app.post("/predict", response_model=Dict[str, Any])
async def predict_food_classification(file: UploadFile = File(...)):
    """
    Predict food classification from uploaded image.
    
    Args:
        file: Uploaded image file (JPEG, PNG, WebP)
        
    Returns:
        Dictionary containing predicted label, confidence, and recommendations
    """
    try:
        # Validate file
        validate_file(file)
        
        # Check if models are loaded
        if image_classifier_model is None or image_label_encoder is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Models not loaded. Please try again later."
            )
        
        # Read and process image
        image_bytes = await file.read()
        
        # Validate file size after reading
        if len(image_bytes) > MAX_IMAGE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Maximum size: {MAX_IMAGE_SIZE / (1024*1024):.1f}MB"
            )
        
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image file or corrupted image"
            )
        
        image_transform = get_image_transform()
        input_tensor = image_transform(image).unsqueeze(0)
        
        with torch.no_grad():
            outputs = image_classifier_model(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted_index = torch.max(probabilities, 1)
            
            predicted_index = predicted_index.item()
            confidence_score = confidence.item()
        
        predicted_label = image_label_encoder.inverse_transform([predicted_index])[0]
        
        try:
            recommendations = recommend_similar_items(predicted_label, top_n=5)
        except Exception as e:
            logger.warning(f"Error getting recommendations: {str(e)}")
            recommendations = []
        
        logger.info(f"Predicted: {predicted_label} with confidence: {confidence_score:.4f}")
        
        return {
            "predicted_label": predicted_label,
            "confidence": round(confidence_score, 4),
            "recommendations": recommendations,
            "status": "success"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error occurred during prediction"
        )

@app.get("/classes", response_model=Dict[str, List[str]])
async def get_available_classes():
    """Get list of available food classes that can be predicted."""
    try:
        if image_label_encoder is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Label encoder not loaded"
            )
        
        classes = image_label_encoder.classes_.tolist()
        return {"classes": sorted(classes), "total_classes": len(classes)}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting classes: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving available classes"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
