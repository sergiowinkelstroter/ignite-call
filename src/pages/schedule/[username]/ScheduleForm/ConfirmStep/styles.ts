import { Box, styled, Text } from "@ignite-ui/react";

export const ConfirmStepContainer = styled(Box, {
  display: "flex",
  flexDirection: "column",

  margin: "$6 auto $12",

  maxWidth: 540,
});

export const ConfirmStepHeader = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$4",

  paddingBottom: "$6",
  borderBottom: "1px solid $gray600",

  div: {
    display: "flex",
    alignItems: "center",
    gap: "$2",
  },
});

export const ConfirmStepInputs = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$6",
  margin: "$6 0 $6 0",

  label: {
    display: "flex",
    flexDirection: "column",
    gap: "$2",
  },
});

export const ConfirmStepActions = styled("div", {
  display: "flex",
  justifyContent: "flex-end",
  gap: "$4",
});

export const FormError = styled(Text, {
  color: "#f75a68",
});
