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

// Institution-specific matching rules
const INSTITUTION_MAPPINGS = {
  // VIT variations
  'vit': 'Vellore Institute of Technology',
  'vit vellore': 'Vellore Institute of Technology',
  'vellore institute of technology': 'Vellore Institute of Technology',
  'vellore institute': 'Vellore Institute of Technology',
  
  // IIT variations
  'iit delhi': 'Indian Institute of Technology Delhi',
  'iitd': 'Indian Institute of Technology Delhi',
  'iit bombay': 'Indian Institute of Technology Bombay',
  'iitb': 'Indian Institute of Technology Bombay',
  'iit madras': 'Indian Institute of Technology Madras',
  'iitm': 'Indian Institute of Technology Madras',
  'iit kanpur': 'Indian Institute of Technology Kanpur',
  'iitk': 'Indian Institute of Technology Kanpur',
  'iit kharagpur': 'Indian Institute of Technology Kharagpur',
  'iit kgp': 'Indian Institute of Technology Kharagpur',
  'iit roorkee': 'Indian Institute of Technology Roorkee',
  'iitr': 'Indian Institute of Technology Roorkee',
  'iit guwahati': 'Indian Institute of Technology Guwahati',
  'iitg': 'Indian Institute of Technology Guwahati',
  'iit hyderabad': 'Indian Institute of Technology Hyderabad',
  'iith': 'Indian Institute of Technology Hyderabad',
  
  // NIT variations
  'nit trichy': 'National Institute of Technology Trichy',
  'nitt': 'National Institute of Technology Trichy',
  'nit warangal': 'National Institute of Technology Warangal',
  'nitw': 'National Institute of Technology Warangal',
  'nit calicut': 'National Institute of Technology Calicut',
  'nitc': 'National Institute of Technology Calicut',
  
  // Other common institutions
  'srm': 'SRM Institute of Science and Technology',
  'srm university': 'SRM Institute of Science and Technology',
  'srm institute': 'SRM Institute of Science and Technology',
  'manipal': 'Manipal Institute of Technology',
  'manipal institute': 'Manipal Institute of Technology',
  'pes': 'PES University',
  'pes university': 'PES University',
  'rv college': 'RV College of Engineering',
  'rvce': 'RV College of Engineering',
  'bms college': 'BMS College of Engineering',
  'bmsce': 'BMS College of Engineering',
  'bits pilani': 'Birla Institute of Technology and Science Pilani',
  'bits': 'Birla Institute of Technology and Science Pilani',
  'iisc': 'Indian Institute of Science Bangalore',
  'iisc bangalore': 'Indian Institute of Science Bangalore'
};

// Fuzzy search functions
export const fuzzySearchInstitution = (input) => {
  if (!input || input.length < 2) return { original: input, cleaned: input, confidence: 0 };
  
  const cleaned = cleanText(input);
  console.log(`Institution search for "${input}" -> cleaned: "${cleaned}"`);
  
  // First, check exact mappings
  if (INSTITUTION_MAPPINGS[cleaned]) {
    console.log(`Exact mapping found: ${cleaned} -> ${INSTITUTION_MAPPINGS[cleaned]}`);
    return {
      original: input,
      cleaned: INSTITUTION_MAPPINGS[cleaned],
      confidence: 95,
      suggestions: [INSTITUTION_MAPPINGS[cleaned]]
    };
  }
  
  // Check partial mappings
  for (const [key, value] of Object.entries(INSTITUTION_MAPPINGS)) {
    if (cleaned.includes(key) || key.includes(cleaned)) {
      console.log(`Partial mapping found: ${key} -> ${value}`);
      return {
        original: input,
        cleaned: value,
        confidence: 85,
        suggestions: [value]
      };
    }
  }
  
  // Fallback to fuzzy search with more restrictive scoring
  const results = institutionFuse.search(cleaned);
  console.log(`Fuzzy search results for "${cleaned}":`, results);
  
  if (results.length > 0) {
    const bestMatch = results[0];
    const score = bestMatch.score || 0;
    
    // More restrictive matching - only accept very good matches
    if (score < 0.3) {
      return {
        original: input,
        cleaned: bestMatch.item.name,
        confidence: Math.round((1 - score) * 100),
        suggestions: results.slice(0, 3).map(r => r.item.name)
      };
    }
  }
  
  // If no good match found, just capitalize the original
  return {
    original: input,
    cleaned: capitalizeWords(input),
    confidence: 40,
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

// Enhanced institution search based on name and type
export const fuzzySearchInstitutionWithType = (institutionName, institutionType) => {
  if (!institutionName || institutionName.length < 2) {
    return { original: institutionName, cleaned: institutionName, confidence: 0 };
  }
  
  const cleanedName = cleanText(institutionName);
  const cleanedType = cleanText(institutionType || '');
  
  console.log(`Institution search for "${institutionName}" (type: "${institutionType}")`);
  
  // First, check exact mappings
  if (INSTITUTION_MAPPINGS[cleanedName]) {
    const mapped = INSTITUTION_MAPPINGS[cleanedName];
    console.log(`Exact mapping found: ${cleanedName} -> ${mapped}`);
    return {
      original: institutionName,
      cleaned: mapped,
      confidence: 95,
      suggestions: [mapped]
    };
  }
  
  // Enhanced search considering both name and type
  const searchQuery = `${cleanedName} ${cleanedType}`.trim();
  
  // Check if type gives us hints about the institution based on actual form values
  if (cleanedType.includes('engineering college') || cleanedType.includes('technology institute')) {
    // Look for IIT matches based on location name
    const iitLocationHints = ['delhi', 'bombay', 'madras', 'kanpur', 'kharagpur', 'roorkee', 'guwahati', 'hyderabad'];
    for (const location of iitLocationHints) {
      if (cleanedName.includes(location)) {
        const iitKey = `iit ${location}`;
        if (INSTITUTION_MAPPINGS[iitKey]) {
          return {
            original: institutionName,
            cleaned: INSTITUTION_MAPPINGS[iitKey],
            confidence: 95,
            suggestions: [INSTITUTION_MAPPINGS[iitKey]]
          };
        }
      }
    }
    
    // Look for NIT matches based on location name
    const nitLocationHints = ['trichy', 'warangal', 'calicut', 'surathkal', 'durgapur', 'jaipur', 'kurukshetra'];
    for (const location of nitLocationHints) {
      if (cleanedName.includes(location)) {
        const nitKey = `nit ${location}`;
        if (INSTITUTION_MAPPINGS[nitKey]) {
          return {
            original: institutionName,
            cleaned: INSTITUTION_MAPPINGS[nitKey],
            confidence: 95,
            suggestions: [INSTITUTION_MAPPINGS[nitKey]]
          };
        }
      }
    }
    
    // Common engineering colleges
    if (cleanedName.includes('vit') || cleanedName.includes('vellore')) {
      return {
        original: institutionName,
        cleaned: 'Vellore Institute of Technology',
        confidence: 95,
        suggestions: ['Vellore Institute of Technology']
      };
    }
    if (cleanedName.includes('srm')) {
      return {
        original: institutionName,
        cleaned: 'SRM Institute of Science and Technology',
        confidence: 95,
        suggestions: ['SRM Institute of Science and Technology']
      };
    }
    if (cleanedName.includes('rv') || cleanedName.includes('rvce')) {
      return {
        original: institutionName,
        cleaned: 'RV College of Engineering',
        confidence: 95,
        suggestions: ['RV College of Engineering']
      };
    }
    if (cleanedName.includes('bms') || cleanedName.includes('bmsce')) {
      return {
        original: institutionName,
        cleaned: 'BMS College of Engineering',
        confidence: 95,
        suggestions: ['BMS College of Engineering']
      };
    }
  }
  
  if (cleanedType.includes('medical college')) {
    // Medical colleges
    if (cleanedName.includes('aiims')) {
      if (cleanedName.includes('delhi')) {
        return {
          original: institutionName,
          cleaned: 'All India Institute of Medical Sciences Delhi',
          confidence: 95,
          suggestions: ['All India Institute of Medical Sciences Delhi']
        };
      }
      return {
        original: institutionName,
        cleaned: 'All India Institute of Medical Sciences',
        confidence: 90,
        suggestions: ['All India Institute of Medical Sciences Delhi']
      };
    }
    if (cleanedName.includes('cmc') || cleanedName.includes('christian medical college')) {
      return {
        original: institutionName,
        cleaned: 'Christian Medical College Vellore',
        confidence: 95,
        suggestions: ['Christian Medical College Vellore']
      };
    }
  }
  
  if (cleanedType.includes('management institute')) {
    // Management institutes
    if (cleanedName.includes('iim')) {
      const iimLocations = ['ahmedabad', 'bangalore', 'calcutta', 'lucknow', 'kozhikode', 'indore'];
      for (const location of iimLocations) {
        if (cleanedName.includes(location)) {
          return {
            original: institutionName,
            cleaned: `Indian Institute of Management ${location.charAt(0).toUpperCase() + location.slice(1)}`,
            confidence: 95,
            suggestions: [`Indian Institute of Management ${location.charAt(0).toUpperCase() + location.slice(1)}`]
          };
        }
      }
    }
    if (cleanedName.includes('isb')) {
      return {
        original: institutionName,
        cleaned: 'Indian School of Business',
        confidence: 95,
        suggestions: ['Indian School of Business']
      };
    }
  }
  
  if (cleanedType.includes('university')) {
    // Universities
    if (cleanedName.includes('manipal')) {
      return {
        original: institutionName,
        cleaned: 'Manipal Institute of Technology',
        confidence: 95,
        suggestions: ['Manipal Institute of Technology']
      };
    }
    if (cleanedName.includes('pes')) {
      return {
        original: institutionName,
        cleaned: 'PES University',
        confidence: 95,
        suggestions: ['PES University']
      };
    }
    if (cleanedName.includes('bits') || cleanedName.includes('pilani')) {
      return {
        original: institutionName,
        cleaned: 'Birla Institute of Technology and Science Pilani',
        confidence: 95,
        suggestions: ['Birla Institute of Technology and Science Pilani']
      };
    }
  }
  
  if (cleanedType.includes('research institute')) {
    // Research institutes
    if (cleanedName.includes('iisc') || cleanedName.includes('indian institute of science')) {
      return {
        original: institutionName,
        cleaned: 'Indian Institute of Science Bangalore',
        confidence: 95,
        suggestions: ['Indian Institute of Science Bangalore']
      };
    }
    if (cleanedName.includes('tifr') || cleanedName.includes('tata institute')) {
      return {
        original: institutionName,
        cleaned: 'Tata Institute of Fundamental Research',
        confidence: 95,
        suggestions: ['Tata Institute of Fundamental Research']
      };
    }
  }
  
  // Check partial mappings with name
  for (const [key, value] of Object.entries(INSTITUTION_MAPPINGS)) {
    if (cleanedName.includes(key) || key.includes(cleanedName)) {
      console.log(`Partial mapping found: ${key} -> ${value}`);
      return {
        original: institutionName,
        cleaned: value,
        confidence: 85,
        suggestions: [value]
      };
    }
  }
  
  // Fallback to fuzzy search with restrictive scoring
  const results = institutionFuse.search(searchQuery);
  console.log(`Fuzzy search results for "${searchQuery}":`, results);
  
  if (results.length > 0) {
    const bestMatch = results[0];
    const score = bestMatch.score || 0;
    
    if (score < 0.3) {
      return {
        original: institutionName,
        cleaned: bestMatch.item.name,
        confidence: Math.round((1 - score) * 100),
        suggestions: results.slice(0, 3).map(r => r.item.name)
      };
    }
  }
  
  // If no good match found, just capitalize the original
  return {
    original: institutionName,
    cleaned: capitalizeWords(institutionName),
    confidence: 40,
    suggestions: results.slice(0, 3).map(r => r.item.name)
  };
};

// Clean all form data - enhanced institution search, simple state/city
export const cleanFormData = (formData) => {
  // Enhanced institution cleaning using both name and type
  const institutionResult = fuzzySearchInstitutionWithType(
    formData.Institution, 
    formData.InstitutionType
  );
  
  // Simple cleaning for other fields - just capitalize properly (no fuzzy search)
  const institutionTypeResult = {
    original: formData.InstitutionType,
    cleaned: capitalizeWords(formData.InstitutionType || ''),
    confidence: 90,
    suggestions: []
  };
  
  const stateResult = {
    original: formData.State,
    cleaned: capitalizeWords(formData.State || ''),
    confidence: 90,
    suggestions: []
  };
  
  const cityResult = {
    original: formData.City,
    cleaned: capitalizeWords(formData.City || ''),
    confidence: 90,
    suggestions: []
  };
  
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
