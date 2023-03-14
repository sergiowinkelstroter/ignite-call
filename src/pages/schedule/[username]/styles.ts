import { Heading, Text, styled } from "@ignite-ui/react";

export const Container = styled("div", {
  maxWidth: 852,
  padding: "0 $4",
  margin: "$6 auto $4",

  "@media (max-width: 600px)": {
    width: 540,
    margin: "auto",
    marginTop: "$10",
  },
});

export const UserHeader = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  [`> ${Heading}`]: {
    lineHeight: "$base",
    marginTop: "$1",
  },

  [`> ${Text}`]: {
    color: "$gray200",
  },
});
