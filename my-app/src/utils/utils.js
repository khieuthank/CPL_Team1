export function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
  
    return date.toLocaleDateString('en-US', options);
  }