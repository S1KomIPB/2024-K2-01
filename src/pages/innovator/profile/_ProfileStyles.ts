import styled from "styled-components";
import { marginStyle } from "Consts/sizing";

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px;
  heigh: 100%;
  
`;

export const CardContainer = styled.div`
  overflow: auto;
  width: 100%;
  white-space: nowrap;
`

export const Horizontal = styled.div`
  display: flex;
  gap: 16px;
`


export const Title2 = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: black;
  margin: 24px 0 16px 0;
`

export const Image = styled.div`    
  borderRadius: "8px";
  height: "130px";
  width: "130px";
  objectFit: "cover";       
`

export const Title = styled.p`
  font-size: 18px;
  font-weight: 700;
  position: relative;
  color: #1F2937;
`;
export const TagContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 4px 8px;
  width: 150px;
  height: 25px;
  background: #e5e7eb;
  border-radius: 20px;
  font-weight: 400;
  margin-left: 16px;
`;

export const Label = styled.p`
  font-style: normal;
  padding: 4px 8px;
  background: #E5E7EB;
  border-radius: 20px;
  font-weight: 400;
  font-size: 12px;
  color: #4b5563;
  text-align: justify;
  width: fit-content;
  cursor: pointer;
  ${marginStyle}
`;
export const Description = styled.div`
  display: flex;
  flex: 1 0 0;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
  color: #4b5563;
  gap: 6px;
  text-align: justify;
  width: 100%;
  word-break: break-word;
  overflow-wrap: anywhere;
  white-space: normal;
`;

export const ActionContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 10px;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10);
`;

export const Icon = styled.img`
  cursor: pointer;
  position: flex;
  justify-content: space-between;
  border-radius: 0px;
  ${marginStyle}
`;

export const SubText = styled.p`
  position: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 8px;
  color: #1F2937;
`;

export const NavbarButton = styled.div`
  display: flex;
  width: 100%
  max-width: 360px;
  padding: 12px 16px;
  position: sticky;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background: var(--Monochrome-White, #FFF);

  /* Shadow - nav */
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.06), 0px -4px 6px 0px rgba(0, 0, 0, 0.10);
`;

export const Text2 = styled.p`
  color: var(--Primary, #347357);
  /* xs/Medium */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%; /* 16.8px */
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: none;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
  padding-bottom: 12px;
`;

export const Background = styled.img`
  width: 100%;
  max-width: 360px;
  height: 150px;
  margin-top: 56px;
`;

export const Logo = styled.img`
  width: 80px;
  height: 80px;
  ${marginStyle}
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  bottom: 0;
  left: 0;
  border: 1px solid;
  align-content: center;
`;

export const ChipContainer = styled.div`
  display: flex;
  gap: 0px;
  align-items: center;
`;

export const Img = styled.img`
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
`;

export const ContPotensiDesa = styled.div`
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  gap: 8px;
  align-self: stretch;
  flex-wrap: wrap;
`;

export const ButtonKontak = styled.div`
display: flex;
width: 100%;
padding: 12px 16px;
align-items: center;
gap: 16px;
margin-top: 12px;
border-radius: 10px;
border: 1px solid var(--Gray-40, #D1D5DB);
background: var(--Monochrome-White, #FFF);
box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)
`;
