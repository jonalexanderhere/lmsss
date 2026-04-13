#!/bin/bash

MODEL_DIR="apps/web/public/models"
mkdir -p $MODEL_DIR

BASE_URL="https://raw.githubusercontent.com/vladmandic/face-api/master/model"

MODELS=(
  "ssd_mobilenetv1_model-weights_manifest.json"
  "ssd_mobilenetv1_model-shard1"
  "face_landmark_68_model-weights_manifest.json"
  "face_landmark_68_model-shard1"
  "face_recognition_model-weights_manifest.json"
  "face_recognition_model-shard1"
)

echo "🛰️ Downloading AI Face Models to $MODEL_DIR..."

for model in "${MODELS[@]}"; do
  if [ ! -f "$MODEL_DIR/$model" ]; then
    echo "⬇️ Downloading $model..."
    curl -L "$BASE_URL/$model" -o "$MODEL_DIR/$model"
  else
    echo "✅ $model already exists."
  fi
done

echo "🎉 Model deployment complete."
