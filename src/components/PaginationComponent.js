import React from "react";
import { NavLink } from 'react-router-dom';
//import { Row, Col} from 'react-bootstrap';
//import {Pagination } from 'react-bootstrap';
const pagination = require('pagination-logic');

 class PaginationComponent extends React.Component {
    
    constructor(props: any) {
        super(props);
        this.state = { pagination: {} };
    }

    getPagination = (props: any) => {
     
        return  pagination({
            total: props.total,
            single: props.pageSize,
            pageSize: props.pageSize,
            currentPage: props.currentPage,
            pageLinkRule: (number: number) => {
                return `?page=${number}`;
            }
        });
    };

    componentWillMount() {
        this.setState({ pagination: this.getPagination(this.props) });
    }

    componentWillReceiveProps(nextProps: any) {
        this.setState({ pagination: this.getPagination(nextProps) });
    }

    render() {
        return   <div className="row" style={{'margin':'10px 0px'}}>
         <div className="col-md-12"><ul className="paginationlist">
        {
            this.state.pagination.hasPrevious &&
            <li><NavLink to={this.state.pagination.previousPage.link}>
               Prev </NavLink>
            </li>
        }
        <li><NavLink className={(this.state.pagination.currentPage == 1) ? 'selected' : ''}  to="?page=1" >1</NavLink></li>

        {this.state.pagination.firstPage.isEllipsis && <li className="uk-disabled"><span style={{'float':'left'}}>...</span></li>}

        {this.state.pagination.pages.map((item: any, key: number) => {
            return (item.number == 1 || item.number == this.state.pagination.pageCount) ? '' :
                <li key={key} ><NavLink className={(this.state.pagination.currentPage == item.number) ? 'selected' : ''}  to={item.link}>{item.number}</NavLink></li>
        })}

        {(this.state.pagination.lastPage.isEllipsis) ? <li className="uk-disabled"><span style={{'float':'left'}}>...</span></li> : ''}

        {
            this.state.pagination.pageCount > 1 &&
            <li >
                <NavLink className={(this.state.pagination.currentPage == this.state.pagination.pageCount) ? 'selected' : ''} to={this.state.pagination.lastPage.link}>{this.state.pagination.pageCount}</NavLink>
            </li>
        }

        {
            this.state.pagination.hasNext &&
                <li><NavLink to={this.state.pagination.nextPage.link}>
                   Next </NavLink></li>
        }
    </ul></div></div>
    }
}

export default PaginationComponent;