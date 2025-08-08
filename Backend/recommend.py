import pickle
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "Models", "Recipe Recommender")

with open(os.path.join(DATA_DIR, 'id_to_name.pkl'), 'rb') as f:
    id_to_name = pickle.load(f)

with open(os.path.join(DATA_DIR, 'name_to_id.pkl'), 'rb') as f:
    name_to_id = pickle.load(f)

item_similarity_matrix = np.load(os.path.join(DATA_DIR, 'item_similarity_matrix.npy'))

def recommend_similar_items(item_name, top_n=5):
    if item_name not in name_to_id:
        return []
    item_id = name_to_id[item_name]
    similarity_scores = item_similarity_matrix[item_id]
    similar_indices = np.argsort(similarity_scores)[::-1]
    similar_indices = similar_indices[similar_indices != item_id]
    top_indices = similar_indices[:top_n]
    recommended_items = [id_to_name[idx] for idx in top_indices]
    return recommended_items
