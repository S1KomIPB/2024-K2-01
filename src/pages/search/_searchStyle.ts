import styled from 'styled-components';

export const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  width: 100%;
`;

export const SearchInput = styled.input`
  padding: 12px 16px;
  width: 100%;
  max-width: 600px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-right: 8px;
`;

export const SearchIcon = styled.img`
  cursor: pointer;
`;

export const ResultsContainer = styled.div`
  padding: 16px;
  width: 100%;
`;

export const ResultItem = styled.div`
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
`;

export const ResultText = styled.p`
  font-size: 14px;
  color: #374151;
`;

export default {
  SearchContainer,
  SearchInput,
  SearchIcon,
  ResultsContainer,
  ResultItem,
  ResultText
};
