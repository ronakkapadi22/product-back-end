export const arrayFormatter = (data, prop) => {
    let obj = {}
    let modifyProp = [...prop]
    const cloneData = [...data]
    const formatData = cloneData?.map((value) => {
        modifyProp.forEach(val => {
            obj[val] = value[val]
        })
        return { ...obj }
    })
    return [...formatData]
}
