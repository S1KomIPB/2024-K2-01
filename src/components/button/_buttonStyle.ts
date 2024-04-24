import { MarginProps, marginStyle } from "Consts/sizing";
import styled, { css } from "styled-components";

interface ButtonProps extends MarginProps {
  size?: "s" | "m" | "l";
  fullWidth?: boolean;
}

export const StyledButton = styled.button<ButtonProps>`
  border-radius: 8px;
  background-color: #347357;
  color: #ffffff;
  font-weight: 500;
  border: none;
  cursor: pointer;

  ${({ size }) => {
    if (size === "s") {
      return css`
        padding: 6px 20px;
        font-size: 10px;
        font-weight: 500;
        line-height: 140%;
      `;
    }
    if (size === "m") {
      return css`
        padding: 12px 24px;
        font-size: 16px;
      `;
    }

    return css`
      padding: 16px 32px;
      font-size: 18px;
    `;
  }}

  :hover {
    background-color: #2e5e4b;
  }

  ${({ fullWidth }) => {
    if (fullWidth)
      return css`
        width: 100%;
      `;
    return css`
      width: fit-content;
    `;
  }}

  ${marginStyle}
`;
