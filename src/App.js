import React, { Component } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button
} from 'reactstrap'
import axios from 'axios'
//import moment from 'moment'
import Masonry from 'react-masonry-component'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast, ToastContainer } from 'react-toastify'
import {
  faSearch,
  faAsterisk
} from '@fortawesome/free-solid-svg-icons'
import './App.css'
import 'react-toastify/dist/ReactToastify.min.css'

library.add(faSearch)
library.add(faAsterisk)

class App extends Component {
  state = {
    loading: false,
    page: 1,
    tags: '',
    posts: []
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    const clientHeight = document.documentElement.clientHeight
    const scrollTop = document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    if (scrollTop + clientHeight >= scrollHeight) this.loadMore()
  }

  onKeyPressText = (e) => {
    if (e.which === 13) this.search()
  }

  onChangeText = (e) => {
    this.setState({
      tags: e.target.value
    })
  }

  search = () => {
    const { loading, tags } = this.state
    if (loading) return
    if (tags === '') return toast.error('검색어를 입력하세요.')
    this.setState({
      page: 1,
      posts: []
    }, () => {
      this.getData()
    })
  }

  loadMore = () => {
    const { loading } = this.state
    if (loading) return
    this.setState({
      page: this.state.page + 1
    }, () => {
      this.getData()
    })
  }

  getData = async () => {
    const { page, tags } = this.state
    const proxy = 'https://cors-anywhere.herokuapp.com/'
    const url = `https://gelbooru.com/index.php?page=dapi&s=post&q=index&pid=${page}&tags=${tags}&json=1`
    this.setState({
      loading: true
    }, async () => {
      const response = await axios.get(proxy + url)
      if (response.status !== 200) return toast.error('해당 검색어는 존재하지 않습니다.')
      const data = response.data
      data.map(i => {
        const post = []
        post.created = i.created_at
        post.url = i.file_url
        this.setState({
          loading: false,
          posts: [
            ...this.state.posts,
            post
          ]
        })
      })
    })
    /*
    <td>
      {item.tags.split(' ').map(i => {
        return (
          <Badge className='mr-1' color='dark'>{i}</Badge>
        )
      })}
    </td>
    */
   // moment(item.created).format('YYYY-MM-DD HH:mm:ss')
  }

  render() {
    const { posts } = this.state
    return (
      <div className='App'>
        <InputGroup
          className='mb-2'
        >
          <Input
            autoFocus
            type='text'
            value={this.state.inputText}
            placeholder='asuna_(sao)'
            onKeyPress={this.onKeyPressText}
            onChange={this.onChangeText}
            readOnly={this.state.loading}
          />
          <InputGroupAddon addonType='append'>
            <Button
              color={this.state.loading ? 'danger' : 'primary'}
              onClick={this.search}
            >
              <FontAwesomeIcon className={this.state.loading ? 'fa-pulse mr-2' : 'mr-2'} icon={this.state.loading ? 'asterisk' : 'search'} />
              Search
            </Button>
          </InputGroupAddon>
        </InputGroup>
        {posts.length >= 0 ? (
          <Masonry
            options={{
              gutter: 5,
              columnWidth: 200,
              transitionDuration: 0
            }}
            disableImagesLoaded={false}
            updateOnEachImageLoad={true}
            imagesLoadedOptions={{}}
          >
            {posts.map((item) => {
              return (
                <a
                  href={item.url}
                  target='_blank'
                >
                  <img
                    src={item.url}
                    style={{ width: '200px', marginBottom: '5px' }}
                    onError={(e) => e.target.style = 'display: none'}
                  />
                </a>
              )
            })}
          </Masonry>
        ) : ''}
        {this.state.loading ? (
          <div className='Loop-Box'>
            <FontAwesomeIcon className='Loop' icon='asterisk' />
          </div>
        ) : ''}
        <ToastContainer
          position='top-center'
          autoClose={2000}
        />
      </div>
    )
  }
}

export default App