import { ReactNode } from "react";
import { Text } from "@chakra-ui/react";

export function SideHeading({ children }: { children: ReactNode }) {
  return (
    <Text
      lineHeight="1rem"
      fontWeight="600"
      fontFamily="Noto Sans"
      textTransform="uppercase"
      marginBottom="1rem"
    >
      {children}
    </Text>
  );
}
