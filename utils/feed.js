exports.feedAnonymizer = function (feed) {
    function timeNoise(ts) {
        const plusOrMinusOne = Math.pow(-1, Math.round(Math.random()));
        const SixMonthsInSeconds = 182.5 * 24 * 60 * 60 * 1000;
        const noise = Math.round(
            plusOrMinusOne * Math.random() * SixMonthsInSeconds);
        return ts + noise;
    }
 
    function anonUser() {
        const animals = [
            "aardvark", 
            "bear", 
            "cat", 
            "dog",
            "elephant", 
            "ferret", 
            "giraffe",
            "horse",
            "iguana", 
            "jackal", 
            "koala", 
            "leopard",
            "moth", 
            "otter",
            "penguin", 
            "rooster",
            "snake",
            "tiger",
            "whale",
            "zebra"
        ]
        const titles = [
            "king",
            "queen",
            "lord",
            "lady",
            "controller",
            "duke",
            "duchess",
            "prince",
            "princess",
            "chief",
            "sage",
            "priest",
            "witch",
            "wizard",
            "rookie"
        ]
        
        const titleIndex = Math.round(Math.random() * titles.length) 
        const chosenTitle = titles[titleIndex % titles.length]

        const animalIndex = Math.round(Math.random() * animals.length) 
        const chosenAnimal = animals[animalIndex % animals.length]

        const randNum = Math.round(999*Math.random())

        const username = `${chosenTitle}-${chosenAnimal}-${randNum}`
            
        const user = {
            username: username
        }

        return user
    }

    const anonFeed = feed.map(
        post => {
            const anonPost = {
                title: post.title,
                ts: timeNoise(post.ts),
                message: post.message,
                user: anonUser()
            }
            return anonPost
        } 
    )

    return anonFeed
}