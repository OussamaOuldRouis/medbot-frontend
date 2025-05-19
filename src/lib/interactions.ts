interface DrugInteraction {
  drug1: string;
  drug2: string;
  description: string;  // This will store the summary
  timestamp: string;
}

export const clearAllInteractions = () => {
  try {
    localStorage.removeItem('recentInteractions');
    console.log('Successfully cleared all recent interactions');
    return true;
  } catch (error) {
    console.error('Error clearing interactions:', error);
    return false;
  }
};

export const addInteraction = (drug1: string, drug2: string, summary: string) => {
  try {
    console.log('addInteraction called with:', { drug1, drug2, summary });

    if (!drug1 || !drug2 || !summary) {
      console.error('Missing required data in addInteraction:', { drug1, drug2, summary });
      return false;
    }

    // Create the new interaction object
    const newInteraction: DrugInteraction = {
      drug1: drug1.trim(),
      drug2: drug2.trim(),
      description: summary.trim(),
      timestamp: new Date().toISOString()
    };

    console.log('Created interaction object:', newInteraction);

    // Get existing interactions
    const existingInteractions = localStorage.getItem('recentInteractions');
    console.log('Current localStorage content:', existingInteractions);
    
    let interactions: DrugInteraction[] = [];
    
    try {
      if (existingInteractions) {
        const parsed = JSON.parse(existingInteractions);
        console.log('Parsed existing interactions:', parsed);
        if (Array.isArray(parsed)) {
          interactions = parsed;
        } else {
          console.error('Stored interactions is not an array, resetting');
          interactions = [];
        }
      }
    } catch (parseError) {
      console.error('Error parsing stored interactions:', parseError);
      interactions = [];
    }

    // Add new interaction at the beginning
    interactions = [newInteraction, ...interactions].slice(0, 10);
    console.log('Final interactions array:', interactions);

    // Save to localStorage
    try {
      localStorage.setItem('recentInteractions', JSON.stringify(interactions));
      console.log('Successfully saved to localStorage');
      return true;
    } catch (storageError) {
      console.error('Error saving to localStorage:', storageError);
      return false;
    }
  } catch (error) {
    console.error('Error in addInteraction:', error);
    return false;
  }
};

export const getRecentInteractions = (): DrugInteraction[] => {
  try {
    const storedInteractions = localStorage.getItem('recentInteractions');
    console.log('Getting recent interactions from localStorage:', storedInteractions);
    
    if (!storedInteractions) {
      console.log('No stored interactions found');
      return [];
    }

    try {
      const interactions = JSON.parse(storedInteractions);
      
      if (!Array.isArray(interactions)) {
        console.error('Stored interactions is not an array');
        return [];
      }

      // Validate each interaction object
      const validInteractions = interactions.filter(interaction => {
        const isValid = interaction &&
          typeof interaction === 'object' &&
          typeof interaction.drug1 === 'string' &&
          typeof interaction.drug2 === 'string' &&
          typeof interaction.description === 'string' &&
          typeof interaction.timestamp === 'string';
        
        if (!isValid) {
          console.error('Invalid interaction object:', interaction);
        }
        
        return isValid;
      });

      console.log('Parsed and validated interactions:', validInteractions);
      return validInteractions;
    } catch (parseError) {
      console.error('Error parsing stored interactions:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error getting recent interactions:', error);
    return [];
  }
}; 