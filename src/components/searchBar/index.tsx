import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SearchInput, SearchContainer } from './_searchBarStyle';
import Search from 'Assets/icons/search.svg'; 

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <SearchContainer>
        <img src={Search} alt="Search Icon" style={{ marginRight: '8px' }} /> 
        <SearchInput type="text" placeholder="Cari inovasi dan inovator di sini..." onChange={handleSearchChange} />
      </SearchContainer>
    </div>
  );
};

ReactDOM.render(<SearchBar />, document.getElementById('root'));

export default SearchBar;
