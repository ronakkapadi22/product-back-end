export const arrayFormatter = (data, prop) => {
    let obj = { ...prop }
    const cloneData = [...data]
    const formatData = cloneData?.map((value) => {
        Object.keys({ ...prop }).forEach(val => {
            obj[val] = value[val]
        })
        return { ...obj }
    })
    return [...formatData]
}