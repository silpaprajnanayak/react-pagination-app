import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';
import _ from 'lodash';
import SearchBarComponent from './SearchBarComponent';

const pageSize = 10;
export const TableComponent = () => {
    const [tableData, setTableData] = useState();
    const [paginatedPosts, setPaginatedPosts] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [resultFound, setResultFound] = useState(false);
    const [checkedId, setChecked] = useState([]);

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/todos/')
        .then(res => {
            setTableData(res.data);
            setPaginatedPosts(_(res.data).slice(0).take(pageSize).value());
            applyFilters();
        });
    }, [searchInput]);

    // Pagination Logic 
    const pageCount = tableData ? Math.ceil(tableData.length/pageSize) : 0;
    if(pageCount === 1) return null;
    const pages = _.range(1, pageCount+1);

    const pagination = (pageNo) => {
        setCurrentPage(pageNo);
        const startIndex = (pageNo - 1) * pageSize;
        const paginatedPost = _(tableData).slice(startIndex).take(pageSize).value();
        setPaginatedPosts(paginatedPost);
    }
     // Search Filter
    const applyFilters = () => {
        let updatedList = tableData;

        // Search Filter
        if (searchInput) {
            updatedList = updatedList.filter(
                (item) =>
                item.title.toLowerCase().search(searchInput.toLowerCase().trim()) !==
                -1
            );
        }

        !updatedList.length ? setResultFound(false) : setResultFound(true);
        setPaginatedPosts(_(updatedList).slice(0).take(pageSize).value());
    }
    
    var checkAllId = [];
    const selectAll = (e) => {
        if(e.target.checked) {
            setTableData(tableData);
            setPaginatedPosts(_(tableData).slice(0).take(pageSize).value());
            paginatedPosts.filter((item) => {
                checkAllId.push(item.id);
            });
            setChecked(checkAllId);
        }
        else {
            setChecked([]);
        }
        
    }

    var storedFiles = [];
    const handleCheck = (item) => {
        let isDataAvailable = false;
        if(storedFiles.length > 0) {
            storedFiles.filter((list, index) => {
                if(list.includes(item.id)) {
                    isDataAvailable = true;
                    storedFiles.splice(index, 1);
                }
            })
        }

        if( (!isDataAvailable && storedFiles.length > 0) || (storedFiles.length === 0 && !isDataAvailable))

        storedFiles.push(item.id);
        setChecked(storedFiles);
    }
    console.log(checkedId);
  return (
    <div style={{backgroundImage: "url(images/app_bg.png)"}}>
        {/* Search Bar */}
        <SearchBarComponent value={searchInput}
            changeInput={(e) => setSearchInput(e.target.value)} />

        <Table striped bordered hover >
            <thead>
                <tr>
                    <th><input type="checkbox" name="all" id="checked_all" value="allchecked" onChange={selectAll} /></th>
                    <th>Id</th>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody>
                {!paginatedPosts ? ("No Data Found") : paginatedPosts.map((data) => (
                    <tr>
                        <td>{checkedId.length > 1 ? <input type="checkbox" name={data.id} value={data.id} onChange={() => handleCheck(data)} style={{marginTop: "0px"}} checked/> : <input type="checkbox" name={data.id} value={data.id} onChange={() => handleCheck(data)} style={{marginTop: "0px"}}/>}</td>
                        <td>{data.id}</td>
                        <td>{data.title}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
        {/* Pagination List Starts*/}
        <div className="mt-3">
            <nav className="d-flex justify-content-center">
            <ul className="pagination">
                {
                pages.map((page)=>(
                    <li className={
                    page === currentPage ? "page-item active" : "page-item"
                    }><p className="page-link" onClick={() => pagination(page)}>{page}</p></li>
                ))
                }
            </ul>
            </nav>
        </div>
        {/* Pagination List Ends*/}
    </div>
  )
}