const fieldsService = {};

// check field validity
fieldsService.fieldChecker = (data, type, value = 0) => {
    switch(type) {
        case 'string':
            return typeof(data) === type && (data.trim().length > value) ? 
                   data.trim() : 
                   false;
        case 'number':
            return typeof(data) === type && (data.trim().length > value) ? 
                    data.trim() : 
                    false;
        case 'phone':
            return typeof(data) === type && (data.trim().length === value) ? 
                    data.trim() : 
                    false;
        case 'boolean':
            return typeof(data) === type && (data.trim() === value) ? 
                    data.trim() : 
                    false;
    }
}

// all fields valids
fieldsService.validityData = (data) => {
    return Object.values(data).every(data => data);
}

module.exports = fieldsService;
