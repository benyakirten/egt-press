export const titleToKebab = (title: string): string => title.toLowerCase().split(" ").join("-")

export const kebabToTitle = (kebabed: string): string => {
    const words = kebabed.split("-")
    return words.map(w => capitalize(w)).join(" ")
}

export const capitalize = (word: string): string => word[0].toUpperCase() + word.slice(1)