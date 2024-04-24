import styled from 'styled-components';

export const SearchInput = styled.input`
  width: calc(100% - 16px);
  padding: 12px; 
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 12px;
  background: var(--Monochrome-White, #FFF);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.06) inset;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center; 
  width: 360px;
  padding: 0px 16px 0px 16px;
`;

export const SearchIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export default { SearchInput, SearchContainer };
