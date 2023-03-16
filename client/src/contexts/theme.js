const theme = {
  breakpoints: ["40em", "52em", "64em"],
  colors: {
    text: "#000",
    background: "#fff",
    primary: "#07c",
    secondary: "#30c",
    muted: "#f6f6f6",
  },
  fonts: {
    body: "system-ui, sans-serif",
    heading: "inherit",
    monospace: "Menlo, monospace",
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25,
  },
  textStyles: {
    heading: {
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
    },
    display: {
      variant: "textStyles.heading",
      fontSize: [5, 6, 7],
      fontWeight: "display",
      letterSpacing: "-0.03em",
      mt: 3,
    },
  },
  styles: {
    root: {
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body",
    },
    h1: {
      variant: "textStyles.heading",
      fontSize: 5,
    },
    h2: {
      variant: "textStyles.heading",
      fontSize: 4,
    },
    h3: {
      variant: "textStyles.heading",
      fontSize: 3,
    },
    h4: {
      variant: "textStyles.heading",
      fontSize: 2,
    },
    h5: {
      variant: "textStyles.heading",
      fontSize: 1,
    },
    h6: {
      variant: "textStyles.heading",
      fontSize: 0,
    },
    p: {
      fontSize: 1,
      lineHeight: "body",
    },
    a: {
      color: "primary",
    },
    pre: {
      fontFamily: "monospace",
      overflowX: "auto",
      code: {
        color: "inherit",
      },
    },
    code: {
      fontFamily: "monospace",
      fontSize: "inherit",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
    },
    th: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    td: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    img: {
      maxWidth: "100%",
      height: "auto",
    },
  },
};

export default theme;
