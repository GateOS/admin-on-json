import * as React from "react";
import { Link } from 'react-router-dom';
import * as type from '../type'
import RestClient from "../rest/RestClient";
import { connect } from 'react-redux'

import { bindActionCreators } from 'redux'

import * as parser from './parser'


export default function Division(config: type.Page): type.ParsedItem {
    let contents;
    if (config.content) {
        contents = config.content.map((item) => {
            var Container = parser.parse(item).container
            return <Container key={Math.random()} />;
        })
    } else {
        contents = config.children
    }
    return {
        config: config,
        container: () => <div >
            {contents}
        </div>
    }
}


parser.register('Division', Division)
