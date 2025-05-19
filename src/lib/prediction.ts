interface PredictionRequest {
  drug1: string;
  drug2: string;
}

interface PredictionResponse {
  has_interaction: boolean;
  severity: string | null;
  description: string | null;
  confidence: number;
}

const PREDICTION_API_URL = 'http://localhost:8000';

export const predictInteraction = async (drug1: string, drug2: string): Promise<PredictionResponse> => {
  try {
    const response = await fetch(`${PREDICTION_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ drug1, drug2 }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error predicting interaction:', error);
    throw error;
  }
}; 