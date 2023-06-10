export function dataBuild(){
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString()
    const formattedTime = currentDate.toLocaleTimeString()

    const customString = `${formattedDate} ${formattedTime}`

    return customString
}

