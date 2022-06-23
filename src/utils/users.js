const users = []

// addUser, removeUser ,getUser ,getUserInRoom

const addUser = ({id,username,room})=>{

    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate data
    if(!username || !room){
        return{
            error : 'User name and room are required' 
        }
    }

    //Check for existingUser

    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //Validate Username

    if(existingUser){
        return{
            error : 'Username is in use!'
        }
    }

    //store User

    const user ={id,username,room}
    users.push(user)
    return { user }
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id)
    
    if (index != -1){
        return users.splice(index,1)[0]
    }
}