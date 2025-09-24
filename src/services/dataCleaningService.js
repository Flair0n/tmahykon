import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import { cleanFormData, getDataQualityStats } from '../utils/fuzzySearch';

// Save cleaned data to a separate collection for testing
export const saveCleanedData = async (originalData, cleanedResults) => {
  try {
    const cleanedEntry = {
      originalId: originalData.id,
      originalData: {
        Institution: originalData.Institution,
        InstitutionType: originalData.InstitutionType,
        State: originalData.State,
        City: originalData.City,
        FullName: originalData.FullName,
        Email: originalData.Email
      },
      cleanedData: cleanedResults.cleaned,
      confidence: cleanedResults.confidence,
      suggestions: cleanedResults.suggestions,
      cleanedAt: Timestamp.now(),
      dataQuality: {
        overallScore: Math.round(
          (cleanedResults.confidence.Institution + 
           cleanedResults.confidence.InstitutionType + 
           cleanedResults.confidence.State + 
           cleanedResults.confidence.City) / 4
        ),
        needsReview: Object.values(cleanedResults.confidence).some(conf => conf < 70)
      }
    };

    const docRef = await addDoc(collection(db, 'cleaned_registrations'), cleanedEntry);
    console.log('Cleaned data saved with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving cleaned data:', error);
    return { success: false, error: error.message };
  }
};

// Process all registrations and save cleaned versions
export const processAllRegistrations = async (registrations) => {
  const results = {
    processed: 0,
    saved: 0,
    errors: [],
    summary: {
      highQuality: 0,
      mediumQuality: 0,
      lowQuality: 0,
      needsReview: 0
    }
  };

  for (const registration of registrations) {
    try {
      results.processed++;
      
      // Clean the data using fuzzy search
      const cleanedResults = cleanFormData(registration);
      
      // Save to cleaned collection
      const saveResult = await saveCleanedData(registration, cleanedResults);
      
      if (saveResult.success) {
        results.saved++;
        
        // Update summary statistics
        const overallScore = Math.round(
          (cleanedResults.confidence.Institution + 
           cleanedResults.confidence.InstitutionType + 
           cleanedResults.confidence.State + 
           cleanedResults.confidence.City) / 4
        );
        
        if (overallScore >= 80) {
          results.summary.highQuality++;
        } else if (overallScore >= 60) {
          results.summary.mediumQuality++;
        } else {
          results.summary.lowQuality++;
        }
        
        if (Object.values(cleanedResults.confidence).some(conf => conf < 70)) {
          results.summary.needsReview++;
        }
      } else {
        results.errors.push({
          registrationId: registration.id,
          error: saveResult.error
        });
      }
    } catch (error) {
      results.errors.push({
        registrationId: registration.id,
        error: error.message
      });
    }
  }

  return results;
};

// Get cleaned data from the collection
export const getCleanedData = async () => {
  try {
    const cleanedCollection = collection(db, 'cleaned_registrations');
    const snapshot = await getDocs(cleanedCollection);
    
    const cleanedData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, data: cleanedData };
  } catch (error) {
    console.error('Error fetching cleaned data:', error);
    return { success: false, error: error.message };
  }
};

// Generate data quality report
export const generateDataQualityReport = async (registrations) => {
  const stats = getDataQualityStats(registrations);
  
  // Get unique values for each field
  const uniqueValues = {
    institutions: [...new Set(registrations.map(r => r.Institution).filter(Boolean))],
    institutionTypes: [...new Set(registrations.map(r => r.InstitutionType).filter(Boolean))],
    states: [...new Set(registrations.map(r => r.State).filter(Boolean))],
    cities: [...new Set(registrations.map(r => r.City).filter(Boolean))]
  };

  // Identify potential duplicates (case-insensitive)
  const findDuplicates = (values) => {
    const normalized = values.map(v => v.toLowerCase().trim());
    const duplicates = [];
    const seen = new Set();
    
    normalized.forEach((norm, index) => {
      if (seen.has(norm)) {
        const existing = duplicates.find(d => d.normalized === norm);
        if (existing) {
          existing.variations.push(values[index]);
        } else {
          duplicates.push({
            normalized: norm,
            variations: [values[index]]
          });
        }
      } else {
        seen.add(norm);
      }
    });
    
    return duplicates.filter(d => d.variations.length > 1);
  };

  const report = {
    ...stats,
    uniqueValues,
    potentialDuplicates: {
      institutions: findDuplicates(uniqueValues.institutions),
      institutionTypes: findDuplicates(uniqueValues.institutionTypes),
      states: findDuplicates(uniqueValues.states),
      cities: findDuplicates(uniqueValues.cities)
    },
    recommendations: []
  };

  // Generate recommendations
  if (report.overallQuality.low > 20) {
    report.recommendations.push('Consider implementing data validation at form input level');
  }
  
  if (report.potentialDuplicates.institutions.length > 5) {
    report.recommendations.push('Institution names need standardization');
  }
  
  if (report.potentialDuplicates.states.length > 2) {
    report.recommendations.push('State names should use dropdown selection');
  }

  return report;
};

// Preview cleaning results without saving
export const previewCleaning = (formData) => {
  return cleanFormData(formData);
};
