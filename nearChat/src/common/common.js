const COLORS = {
    //For Dark Theme
    DARK_PRIMARY_COLOR: '#F0F424',//FBC02D BLACK,WHITE

    //For Light Theme
    LIGHT_PRIMARY_COLOR: '#2196F3',//YELLOW , BLACK, WHITE

    BLACK_COLOR: '#000000',
    WHITE_COLOR: '#FFFFFF',
    INCOME_COLOR: '#55beba',
    EXPENSE_COLOR: '#d4635d',

    FONT_12: 12,
    FONT_14: 14,
    FONT_16: 16,
    FONT_18: 18,
    FONT_24: 24,

};

const TEXT_STYLES = {
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.SECONDARY_TEXT_COLOR,
    },
    subheader: {
        fontSize: 18,
        color: COLORS.SECONDARY_TEXT_COLOR,
    },
    normalText: {
        color: '#000'
    }
}

export { COLORS, TEXT_STYLES };
