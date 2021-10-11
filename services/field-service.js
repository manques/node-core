const fieldsService = {};

// check field validity
fieldsService.fieldChecker = (data, type, value = 0) => {
    // console.log(data);
    switch(type) {
        case 'string':
            return typeof(data) === type && (data.trim().length > value) ? 
                   data.trim() : 
                   false;
        case 'number':
            const num = Number(data && data.trim());
            console.log(num);
            return num && typeof(num) === type && (data.trim().length > value) ? 
                    num : 
                    false;
        case 'phone':
            const numPhone = Number(data && data.trim());
            console.log('phone');
            console.log(typeof(numPhone));
            return numPhone && typeof(numPhone) === 'number' && (data.trim().length === value) ? 
                    numPhone :
                    false;
        case 'boolean':
            return typeof(data) === type && (data === value) ? 
                    data : 
                    false;
    }
}

// all fields valids
fieldsService.validityEvery = (data) => {
    return Object.values(data).every(data => data);
}
// at least one field valid
fieldsService.validitySome = (data) => {
    return Object.values(data).some(data => data);
}

module.exports = fieldsService;
