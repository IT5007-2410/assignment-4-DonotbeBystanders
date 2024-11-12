import React, { useState } from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  useColorScheme,
  View,
} from 'react-native';

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  try {
    /****** Q4: Start Coding here. State the correct IP/port******/
    const response = await fetch('http://192.168.20.30:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
      /****** Q4: Code Ends here******/
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

class IssueFilter extends React.Component {
  render() {
    return (
      <>
        {/****** Q1: Start Coding here. ******/}
        <TextInput
          placeholder="Filter by title"
          style={styles.input}
          onChangeText={(text) => {
            this.props.onFilterChange({ title: text, status: this.props.state.status || '' });
          }}
        />
        <TextInput
          placeholder="Filter by status"
          style={styles.input}
          onChangeText={(text) => {
            this.props.onFilterChange({ title: this.props.state.title || '', status: text });
          }}
        />
        {/****** Q1: Code ends here ******/}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 20, backgroundColor: '#f4f4f9' },
  header: { height: 50, backgroundColor: '#537791', borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  text: { textAlign: 'center', color: '#3e3e3e' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#f2f2f2' },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  filterContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: 200,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4e4e4e',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  rowStyle: {
    height: 40,
    backgroundColor: '#e6e6e6',
  },
  tableHeader: {
    backgroundColor: '#537791',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navigationContainer: {
    marginTop: 20,
    paddingLeft: 8,
    paddingRight: 8,
    height: 110,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navigationItem: {
    width: '30%',
  }
});

const width = [40, 80, 80, 80, 80, 80, 200];

function IssueRow(props) {
  const issue = props.issue;
  {/****** Q2: Coding Starts here. Create a row of data in a variable******/ }
  const rowData = [
    issue.id || 'N/A',
    issue.title || 'No Title',
    issue.status || 'No Status',
    issue.owner || 'Unassigned',
    issue.created ? new Date(issue.created).toLocaleString() : 'No Date',
    issue.effort || '0',
    issue.due ? new Date(issue.due).toLocaleString() : 'No Due Date',
  ];

  {/****** Q2: Coding Ends here.******/ }
  return (
    <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <Row data={rowData} style={styles.rowStyle} textStyle={styles.text} />
      {/****** Q2: Coding Ends here. ******/}
    </>
  );
}


function IssueTable(props) {
  const issueRows = props.issues.map(issue =>
    <IssueRow key={issue.id} issue={issue} />
  );

  {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/ }
  const tableHeader = ['ID', 'Title', 'Status', 'Owner', 'Created', 'Effort', 'Due'];
  {/****** Q2: Coding Ends here. ******/ }

  return (
    <View style={styles.tableContainer}>
      {/****** Q2: Start Coding here to render the table header/rows.**********/}
      <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
        <Row data={tableHeader} style={styles.tableHeader} textStyle={styles.headerText} />
        {issueRows}
      </Table>
      {/****** Q2: Coding Ends here. ******/}
    </View>
  );
}


class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q3: Start Coding here. Create State to hold inputs******/
    this.state = {
      title: '',
      status: 'New',
      owner: '',
      effort: '',
      due: '',
    };
    /****** Q3: Code Ends here. ******/
  }

  /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  handleChange = (field, value) => {
    this.setState({ [field]: value });
  };
  /****** Q3: Code Ends here. ******/

  handleSubmit() {
    /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
    const { title, status, owner, effort, due } = this.state;
    const issue = { title, status, owner, effort: parseInt(effort), due: new Date(due) };
    this.props.onAddIssue(issue); // Call parent component's method
    this.setState({ title: '', status: 'New', owner: '', effort: '', due: '' }); // Clear form
    /****** Q3: Code Ends here. ******/
  }

  render() {
    return (
      <View>
        {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <TextInput
          placeholder="Title"
          value={this.state.title}
          onChangeText={(value) => this.handleChange('title', value)}
          style={styles.input}
        />
        <TextInput
          placeholder="Owner"
          value={this.state.owner}
          onChangeText={(value) => this.handleChange('owner', value)}
          style={styles.input}
        />
        <TextInput
          placeholder="Effort"
          keyboardType="numeric"
          value={this.state.effort}
          onChangeText={(value) => this.handleChange('effort', value)}
          style={styles.input}
        />
        <TextInput
          placeholder="Due date"
          value={this.state.due}
          onChangeText={(value) => this.handleChange('due', value)}
          style={styles.input}
        />
        <Button title="Add Issue" onPress={this.handleSubmit} />
        {/****** Q3: Code Ends here. ******/}
      </View>
    );
  }
}

class BlackList extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q4: Start Coding here. Create State to hold inputs******/
    this.state = { nameInput: '' };
    /****** Q4: Code Ends here. ******/
  }
  /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  handleChange = (value) => {
    this.setState({ nameInput: value });
  };
  /****** Q4: Code Ends here. ******/

  async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    const { nameInput } = this.state;
    const query = `mutation addToBlacklist($nameInput: String!) {
        addToBlacklist(nameInput: $nameInput)
      }`;

    const data = await graphQLFetch(query, { nameInput });
    if (data) {
      alert('Name added to blacklist');
    }
    this.setState({ nameInput: '' }); // Clear input
    /****** Q4: Code Ends here. ******/
  }

  render() {
    return (
      <View>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <TextInput
          placeholder="Enter name"
          value={this.state.nameInput}
          onChangeText={this.handleChange}
          style={styles.input}
        />
        <Button title="Add to Blacklist" onPress={this.handleSubmit} />
        {/****** Q4: Code Ends here. ******/}
      </View>
    );
  }
}

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
    }
  }


  render() {
    return (
      <>
        {/****** Q1: Start Coding here. ******/}
        <View style={styles.navigationContainer}>
          <View style={styles.navigationItem}>
            <Button
              title="View Issues"
              color={(!this.state.navigation || this.state.navigation === 'IssueTable') ? '#4e4e4e' : ''}
              onPress={() => this.setState({ navigation: 'IssueTable' })}
            />
          </View>
          <View style={styles.navigationItem}>
            <Button
              title="Add New Issue"
              color={this.state.navigation === 'IssueAdd' ? '#4e4e4e' : ''}
              onPress={() => this.setState({ navigation: 'IssueAdd' })}
            />
          </View>
          <View style={styles.navigationItem}>
            <Button
              title="Blacklist"
              color={this.state.navigation === 'BlackList' ? '#4e4e4e' : ''}
              onPress={() => this.setState({ navigation: 'BlackList' })}
            />
          </View>
        </View>
        {(!this.state.navigation || this.state.navigation === 'IssueTable') &&
          <IssueFilter state={this.state} onFilterChange={(filter) => {
            console.log(filter.title, filter.status)
            let originIssues = this.state.originIssues;
            if (!originIssues || this.state.issues.length > originIssues.length) {
              originIssues = this.state.issues
            }
            console.log(filter)
            const filteredIssues = originIssues.filter(issue =>
              (!filter.title || issue.title.includes(filter.title)) && (!issue.status || issue.status.includes(filter.status))
            );
            console.log(originIssues, filteredIssues)
            this.setState({ issues: filteredIssues, originIssues: originIssues, title: filter.title, status: filter.status });
          }} />}
        {/****** Q1: Code ends here ******/}


        {/****** Q2: Start Coding here. ******/}
        {(!this.state.navigation || this.state.navigation === 'IssueTable') && <IssueTable issues={this.state.issues} />}
        {/****** Q2: Code ends here ******/}


        {/****** Q3: Start Coding here. ******/}
        {this.state.navigation && this.state.navigation === 'IssueAdd' && <IssueAdd onAddIssue={this.createIssue} />}
        {/****** Q3: Code Ends here. ******/}

        {/****** Q4: Start Coding here. ******/}
        {this.state.navigation && this.state.navigation === 'BlackList' && <BlackList />}
        {/****** Q4: Code Ends here. ******/}
      </>

    );
  }
}
