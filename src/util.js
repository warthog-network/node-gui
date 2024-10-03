export function abbreviate(hex) {
    if (hex.length > 8)
        return hex.slice(0,4)+"..."+hex.slice(-4)
    return hex
}
export function format_height(height){
    return height.toLocaleString('en-US')
}
