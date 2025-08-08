# Food Image Classifier & Recipe Recommendation API

This project provides an end-to-end food image classification and recipe recommendation system.

- The **backend** is built with **FastAPI**.
- Image classification uses **transfer learning** with **DenseNet201**.
- Recipe recommendations are based on **cosine similarity**.
- Authentication is handled via **Supabase**.
- The **frontend** is built with **React** for image upload and displaying results.

---

## Features

- Classify food images into 101 categories using a DenseNet201 model fine-tuned on the Food101 dataset.
- Recommend similar recipes based on the predicted food item using cosine similarity.
- User authentication and authorization with Supabase.
- React frontend with image preview and upload functionality.
- Note: Some food classes may not have corresponding recipes in the recommendation system.

---

## Backend Setup

1. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
