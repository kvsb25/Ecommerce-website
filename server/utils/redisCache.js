const Redis = require("redis");
const redisClient = Redis.createClient();
const {DEFAULT_EXPIRATION} = require("../constants/redis.js");

redisClient.on("error", (err) => console.error("Redis Error:", err));

(async () => {
    await redisClient.connect();
    console.log("Connected to Redis.");
})();

module.exports.getOrSetCache = async (key, cb) =>{
    try{
    console.log(key);
    // redisClient.get(key, async(error, data)=>{
    //     if(error) return reject(error);
    //     if(data != null) return resolve(JSON.parse(data));
    //     const freshData = await cb();
    //     await redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
    //     resolve(freshData);
    // })
    const data =  await redisClient.get(key);
    // if(data) return reject(error);
    console.log((data)? `data: ${data}` : "Cache Miss");
    if(data != null) return (JSON.parse(data));
    const freshData = await cb();
    console.log((freshData)? `fresh data: ${freshData}` : "Cache Hit")
    await redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
    return freshData;
    } catch (err) {
        console.error("Redis error: ", err);
    }
}