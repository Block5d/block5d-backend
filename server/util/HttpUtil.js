function getModelPath(originalUrl){
    let values = originalUrl.split("/");
    return values[4];
}

module.exports = {
    getModelPath
};