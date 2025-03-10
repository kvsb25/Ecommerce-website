module.exports.returnErrorMessages = (e)=>{
    if (e._message === 'user validation failed') {
        let validationErrors = [];
        Object.keys(e.errors).forEach(ele => {
            validationErrors.push(e.errors[ele].properties.message);
        });
        return validationErrors;
    }
}