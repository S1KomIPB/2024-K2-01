import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SearchInput, SearchContainer } from './_searchBarStyle';
import Search from 'Assets/icons/search.svg'; 

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <div>
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="Cari inovasi dan inovator di sini..." 
          style={{ backgroundImage: `url(${Search})`, backgroundPosition: '10px center', backgroundRepeat: 'no-repeat', paddingLeft: '40px' }} 
        />
      </SearchContainer>
    </div>
  );
};

ReactDOM.render(<SearchBar />, document.getElementById('root'));

export default SearchBar;
