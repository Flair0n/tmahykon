// Fuzzy search and data cleaning utilities
import Fuse from 'fuse.js';

// Master data for fuzzy matching
const MASTER_DATA = {
  institutions: [
    // Engineering Colleges - with variations
    'Indian Institute of Technology Delhi',
    'IIT Delhi',
    'IITD',
    'Indian Institute of Technology Bombay',
    'IIT Bombay',
    'IITB',
    'Indian Institute of Technology Madras',
    'IIT Madras',
    'IITM',
    'Indian Institute of Technology Kanpur',
    'IIT Kanpur',
    'IITK',
    'Indian Institute of Technology Kharagpur',
    'IIT Kharagpur',
    'IIT KGP',
    'Indian Institute of Technology Roorkee',
    'IIT Roorkee',
    'IITR',
    'Indian Institute of Technology Guwahati',
    'IIT Guwahati',
    'IITG',
    'Indian Institute of Technology Hyderabad',
    'IIT Hyderabad',
    'IITH',
    'Indian Institute of Science Bangalore',
    'IISc Bangalore',
    'IISc',
    'National Institute of Technology Trichy',
    'NIT Trichy',
    'NITT',
    'National Institute of Technology Warangal',
    'NIT Warangal',
    'NITW',
    'National Institute of Technology Calicut',
    'NIT Calicut',
    'NITC',
    'Delhi Technological University',
    'Netaji Subhas University of Technology',
    'Birla Institute of Technology and Science Pilani',
    'Vellore Institute of Technology',
    'SRM Institute of Science and Technology',
    'Manipal Institute of Technology',
    'PES University',
    'RV College of Engineering',
    'BMS College of Engineering',
    'MS Ramaiah Institute of Technology',
    'Dayananda Sagar College of Engineering',
    'JSS Science and Technology University',
    
    // Universities
    'University of Delhi',
    'Jawaharlal Nehru University',
    'Jamia Millia Islamia',
    'Aligarh Muslim University',
    'Banaras Hindu University',
    'University of Mumbai',
    'University of Pune',
    'Anna University',
    'University of Madras',
    'Osmania University',
    'University of Hyderabad',
    'Jadavpur University',
    'University of Calcutta',
    'Presidency University',
    'Christ University',
    'Symbiosis International University',
    
    // Medical Colleges
    'All India Institute of Medical Sciences Delhi',
    'All India Institute of Medical Sciences Mumbai',
    'Christian Medical College Vellore',
    'Armed Forces Medical College',
    'King Georges Medical University',
    'Post Graduate Institute of Medical Education and Research',
    
    // Management Institutes
    'Indian Institute of Management Ahmedabad',
    'Indian Institute of Management Bangalore',
    'Indian Institute of Management Calcutta',
    'Indian Institute of Management Lucknow',
    'Indian School of Business',
    'Xavier Labour Relations Institute',
    'Faculty of Management Studies Delhi',
    
    // Others
    'Indian Statistical Institute',
    'Tata Institute of Fundamental Research',
    'Indian Institute of Foreign Trade',
    'National Law School of India University'
  ],
  
  institutionTypes: [
    'Government College',
    'Private College',
    'Deemed University',
    'Central University',
    'State University',
    'Private University',
    'Institute of National Importance',
    'Autonomous College',
    'Self-Financed College',
    'Aided College',
    'Technical Institute',
    'Research Institute',
    'Medical College',
    'Engineering College',
    'Management Institute',
    'Law College',
    'Arts and Science College'
  ],
  
  states: [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep',
    'Puducherry',
    'Andaman and Nicobar Islands'
  ],
  
  cities: [
    // Major Cities
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
    'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
    'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
    'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar',
    'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
    'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur',
    'Madurai', 'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubballi-Dharwad',
    'Tiruchirappalli', 'Bareilly', 'Mysore', 'Tiruppur', 'Gurgaon', 'Aligarh', 'Jalandhar',
    'Bhubaneswar', 'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur',
    'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad',
    'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela',
    'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni',
    'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli-Miraj & Kupwad', 'Mangalore',
    'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon', 'Udaipur'
  ]
};

// Fuzzy search configuration
const FUSE_OPTIONS = {
  threshold: 0.6, // Higher = more lenient matching
  distance: 100,
  maxPatternLength: 64,
  minMatchCharLength: 3,
  keys: ['name'],
  includeScore: true,
  shouldSort: true,
  findAllMatches: false
};

// Create Fuse instances for each data type
const createFuseInstance = (data) => {
  const formattedData = data.map(item => ({ name: item }));
  return new Fuse(formattedData, FUSE_OPTIONS);
};

const institutionFuse = createFuseInstance(MASTER_DATA.institutions);
const institutionTypeFuse = createFuseInstance(MASTER_DATA.institutionTypes);
const stateFuse = createFuseInstance(MASTER_DATA.states);
const cityFuse = createFuseInstance(MASTER_DATA.cities);

// Text cleaning utilities
const cleanText = (text) => {
  if (!text) return '';
  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s&-]/g, '') // Remove special characters except &, -, and spaces
    .toLowerCase();
};

const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Fuzzy search functions
export const fuzzySearchInstitution = (input) => {
  if (!input || input.length < 2) return { original: input, cleaned: input, confidence: 0 };
  
  const cleaned = cleanText(input);
  const results = institutionFuse.search(cleaned);
  
  console.log(`Institution search for "${input}":`, results);
  
  if (results.length > 0) {
    const bestMatch = results[0];
    const score = bestMatch.score || 0;
    
    // More lenient matching - accept matches with score < 0.6
    if (score < 0.6) {
      return {
        original: input,
        cleaned: bestMatch.item.name,
        confidence: Math.round((1 - score) * 100),
        suggestions: results.slice(0, 3).map(r => r.item.name)
      };
    }
  }
  
  // If no good match found, try partial matching
  const partialMatches = MASTER_DATA.institutions.filter(inst => 
    inst.toLowerCase().includes(cleaned.toLowerCase()) || 
    cleaned.toLowerCase().includes(inst.toLowerCase())
  );
  
  if (partialMatches.length > 0) {
    return {
      original: input,
      cleaned: partialMatches[0],
      confidence: 70,
      suggestions: partialMatches.slice(0, 3)
    };
  }
  
  return {
    original: input,
    cleaned: capitalizeWords(input),
    confidence: 30,
    suggestions: results.slice(0, 3).map(r => r.item.name)
  };
};

export const fuzzySearchInstitutionType = (input) => {
  if (!input || input.length < 2) return { original: input, cleaned: input, confidence: 0 };
  
  const cleaned = cleanText(input);
  const results = institutionTypeFuse.search(cleaned);
  
  if (results.length > 0 && results[0].score < 0.4) {
    return {
      original: input,
      cleaned: results[0].item.name,
      confidence: Math.round((1 - results[0].score) * 100),
      suggestions: results.slice(0, 3).map(r => r.item.name)
    };
  }
  
  return {
    original: input,
    cleaned: capitalizeWords(input),
    confidence: 50,
    suggestions: results.slice(0, 3).map(r => r.item.name)
  };
};

export const fuzzySearchState = (input) => {
  if (!input || input.length < 2) return { original: input, cleaned: input, confidence: 0 };
  
  const cleaned = cleanText(input);
  const results = stateFuse.search(cleaned);
  
  if (results.length > 0 && results[0].score < 0.3) {
    return {
      original: input,
      cleaned: results[0].item.name,
      confidence: Math.round((1 - results[0].score) * 100),
      suggestions: results.slice(0, 3).map(r => r.item.name)
    };
  }
  
  return {
    original: input,
    cleaned: capitalizeWords(input),
    confidence: 50,
    suggestions: results.slice(0, 3).map(r => r.item.name)
  };
};

export const fuzzySearchCity = (input) => {
  if (!input || input.length < 2) return { original: input, cleaned: input, confidence: 0 };
  
  const cleaned = cleanText(input);
  const results = cityFuse.search(cleaned);
  
  if (results.length > 0 && results[0].score < 0.3) {
    return {
      original: input,
      cleaned: results[0].item.name,
      confidence: Math.round((1 - results[0].score) * 100),
      suggestions: results.slice(0, 3).map(r => r.item.name)
    };
  }
  
  return {
    original: input,
    cleaned: capitalizeWords(input),
    confidence: 50,
    suggestions: results.slice(0, 3).map(r => r.item.name)
  };
};

// Clean all form data
export const cleanFormData = (formData) => {
  const institutionResult = fuzzySearchInstitution(formData.Institution);
  const institutionTypeResult = fuzzySearchInstitutionType(formData.InstitutionType);
  const stateResult = fuzzySearchState(formData.State);
  const cityResult = fuzzySearchCity(formData.City);
  
  return {
    original: {
      Institution: formData.Institution,
      InstitutionType: formData.InstitutionType,
      State: formData.State,
      City: formData.City
    },
    cleaned: {
      Institution: institutionResult.cleaned,
      InstitutionType: institutionTypeResult.cleaned,
      State: stateResult.cleaned,
      City: cityResult.cleaned
    },
    confidence: {
      Institution: institutionResult.confidence,
      InstitutionType: institutionTypeResult.confidence,
      State: stateResult.confidence,
      City: cityResult.confidence
    },
    suggestions: {
      Institution: institutionResult.suggestions,
      InstitutionType: institutionTypeResult.suggestions,
      State: stateResult.suggestions,
      City: cityResult.suggestions
    }
  };
};

// Get statistics about data quality
export const getDataQualityStats = (registrations) => {
  let totalRecords = registrations.length;
  let highConfidenceMatches = 0;
  let mediumConfidenceMatches = 0;
  let lowConfidenceMatches = 0;
  
  const fieldStats = {
    Institution: { exact: 0, fuzzy: 0, unknown: 0 },
    InstitutionType: { exact: 0, fuzzy: 0, unknown: 0 },
    State: { exact: 0, fuzzy: 0, unknown: 0 },
    City: { exact: 0, fuzzy: 0, unknown: 0 }
  };
  
  registrations.forEach(reg => {
    const cleanedData = cleanFormData(reg);
    
    Object.keys(fieldStats).forEach(field => {
      const confidence = cleanedData.confidence[field];
      if (confidence > 80) {
        fieldStats[field].exact++;
        highConfidenceMatches++;
      } else if (confidence > 50) {
        fieldStats[field].fuzzy++;
        mediumConfidenceMatches++;
      } else {
        fieldStats[field].unknown++;
        lowConfidenceMatches++;
      }
    });
  });
  
  return {
    totalRecords,
    overallQuality: {
      high: Math.round((highConfidenceMatches / (totalRecords * 4)) * 100),
      medium: Math.round((mediumConfidenceMatches / (totalRecords * 4)) * 100),
      low: Math.round((lowConfidenceMatches / (totalRecords * 4)) * 100)
    },
    fieldStats
  };
};
