import React from 'react';
import './App.css';
import api from './api';
import PostView from './Components/PostView'

import Container from '@material-ui/core/Container'; // 꾸미기
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      title :'',
      content : '',
      results : [],
    }
  }

  componentDidMount() { // 데이터를 요청하려면... mout하기
    this.getPosts()
  }

  async getPosts() {
    const _results = await api.getAllPosts() // 글을 받아와서 _result에 넣고,
    // apic.getAllPost()를 실행하는데 시간이 걸리니까... 완료될 때까지 기다리라고 말해주어야 함, 비동기!!를 기억하자~
    this.setState({results : _results.data}) // 그걸 results에 넣음... axios가 데이터를 --.data에 넣어주기 때문에 .data 붙여주기
    console.log(_results)
  }

  /*handlingChange = (event) => {
    this.setState({title : event.target.value})
  } // 제목과 내용을 작성하기 위해 동일한 내용의 코드를 작성해야 함
  // 코드를 낭비하게 되므로 이를 해결할 방법이 필요, 두 가지 방법이 있고, 아래와 같이 작성

  handlingChange = (name) => (event) =>{
    this.setState({[name]: event.target.value})
  }*/

  // Change가 요청했을 때 처리
  handlingChange = (event) => {
    this.setState({[event.target.name] : event.target.value}) // event가 발생한 곳의 value를 event가 발생한 곳의 이름으로 setState에 저장?
  }

  // submit이 요청했을 때 처리
  handlingSubmit = async (event) =>
  {
    event.preventDefault() // event의 기본 기능을 막아줌, 여기서는 새로 고침을 막아줌
    let result = await api.createPost({title : this.state.title, content : this.state.content})
    // axios는 promise 기반이고 promise는 비동기...
    // api.createPost()가 완료된 후, 그 결과를 result에 담고 싶으니까 비동기로 수행되는 것을 동기로 수행되게 만들 필요가 있음
    // async와 await을 이용, async가 오는 위치를 주의합시다!!
    console.log("완료", result)
    this.setState({title : '', content : ''}) // 저장했으니까 setState 초기화
    this.getPosts()
  }

  /* delete를 요청했을 때 처리
    handlingDelete = async (event) => {
    await api.deletePost(event.target.value) // api.deletePost()가 완료될 때까지 기다렸다가,
    this.getPosts() //  글 목록 가지고 와
  } // 우리가 직접 만든 버튼을 사용하는 경우*/

  handlingDelete = async (id) => {
    await api.deletePost(id)
    this.getPosts()
  }

  render(){
    return (
      <div className="App">
        <Container maxWidth="lg">
          <Paper className = "PostingPaper">
            <div className = "PostSection">
              <h2>글 작성하기</h2>
              <form className = "PostingForm" onSubmit = {this.handlingSubmit}>

              <TextField
                id = "outlined-name"
                label = "title"
                name = "title"
                // className = {classes.TextField}
                value={this.state.title}
                onChange = {this.handlingChange}
                // onChange = {this.handlingChange('title')}
                margin = "normal"
                variant = "outlined"
              />
              
              <TextField
                id = "outlined-name"
                label = "content"
                name = "content"
                multiline
                rows = "4"
                // className = {classes.TextField}
                value={this.state.content}
                onChange = {this.handlingChange}
                // onChange = {this.handlingChange('content')}
                margin = "normal"
                variant = "outlined"
              />
              <Button variant="outlined" type = "submit">저장하기</Button>
              </form>
            </div>
          </Paper>
          <div className = "ViewSection">
            <h2>글 목록</h2>
            {
              this.state.results.map((post) => // results를 불러와서 하나의 post로 만들고?
                <Card className={'card'}>
                  <CardContent>
                    <Typography>
                      <PostView title = {post.title} content = {post.content} key = {post.id} id = {post.id}/>
                      {/*post에 대한 정보를 PostView를 이용해 뿌려주겠다!!*/}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button color = "secondary" size="small" onClick = {(event) => this.handlingDelete(post.id)}>삭제하기</Button>
                  </CardActions>
                </Card>
              )
            }          
          </div>
        </Container>
      </div>
    )
  }
}

export default App;