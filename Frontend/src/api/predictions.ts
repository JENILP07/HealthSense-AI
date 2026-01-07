export interface PatientData {
  age: number;
  sex: number;
  // ... add all other fields
}

export const fetchPrediction = async (data: PatientData) => {
  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};