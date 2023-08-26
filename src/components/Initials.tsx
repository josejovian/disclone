import React, { useMemo } from "react";
import { Box, Text } from "@chakra-ui/react";

export interface BoxedInitialsProps {
  color?: string;
  size?: string;
  initials?: string;
  name?: string;
}

export function BoxedInitials(props: BoxedInitialsProps) {
  const { name, size } = props;

  const { color, initials } = useMemo(
    () =>
      name
        ? {
            initials: getInitials(name),
            color: getColor(name),
            ...props,
          }
        : props,
    [name, props]
  );

  return (
    <Box position="relative" width={size}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minWidth={size}
        width={size}
        height={size}
        borderRadius="md"
        background={color}
        userSelect="none"
      >
        <Text
          color="white"
          fontSize={`calc(${size} - 1rem)`}
          fontWeight="700"
          lineHeight="2rem"
          userSelect="none"
        >
          {initials}
        </Text>
      </Box>
    </Box>
  );
}

export function getColor(str = "") {
  if (str === undefined || str === null) return;

  let _min = 1000,
    _max = -1,
    _sum = 0,
    _avg = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    if (_min > char) _min = char;

    if (char > _max) _max = char;

    _sum += char;
  }
  _avg = Math.floor(_sum / str.length);

  /* Reference:
   * https://flatuicolors.com/palette/defo
   */
  let palette = [
    "#16a085",
    "#2980b9",
    "#8e44ad",
    "#f39c12",
    "#d35400",
    "#c0392b",
    "#2c3e50",
  ];

  const _num =
    Math.floor((str.length * (_avg + _sum)) / (_max - _min)) % palette.length;
  // console.log(_num);

  return palette[_num];
}

export function getInitials(str = "") {
  if (str === undefined || str === null) return;

  let initials = "";

  str = str.toUpperCase();

  initials += str[0];

  let space = false;
  for (let i = 1; i < str.length && initials.length < 2; i++) {
    if (str[i] === " ") space = true;
    else if (space === true) {
      initials += str[i];
      space = false;
    }
  }

  return initials;
}
