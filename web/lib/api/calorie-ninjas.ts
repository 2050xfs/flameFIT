const API_KEY = process.env.CALORIENINJAS_API_KEY
const BASE_URL = 'https://api.calorieninjas.com/v1/nutrition'

export interface CalorieNinjaItem {
    name: string;
    calories: number;
    serving_size_g: number;
    fat_total_g: number;
    fat_saturated_g: number;
    protein_g: number;
    sodium_mg: number;
    potassium_mg: number;
    cholesterol_mg: number;
    carbohydrates_total_g: number;
    fiber_g: number;
    sugar_g: number;
}

export const calorieNinjas = {
    nutrition: {
        search: async (query: string): Promise<CalorieNinjaItem[]> => {
            if (!API_KEY) {
                console.warn('Missing CalorieNinjas API key')
                return []
            }

            try {
                const response = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}`, {
                    headers: {
                        'X-Api-Key': API_KEY
                    }
                })

                if (!response.ok) {
                    throw new Error(`CalorieNinjas API Failed: ${response.statusText}`)
                }

                const data = await response.json()
                return data.items || []
            } catch (error) {
                console.error("CalorieNinjas Error:", error)
                return []
            }
        }
    }
}
