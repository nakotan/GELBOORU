import React, { Component } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button
} from 'reactstrap'
import axios from 'axios'
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
    tags: 'asuna_(sao)',
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
    if (scrollTop + clientHeight >= scrollHeight - 10) this.loadMore()
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

  download = () => {
    if (this.state.posts.length < 1) return toast.error('검색된 이미지가 없습니다.')
    const file = this.state.posts[0]
    const directory = file.directory.replace(/\/+/g, '_')
    const url = `http://localhost:3000/api/${directory}/${file.image}`
    const link = document.createElement('a')
    link.href = url
    link.download = file.image
    link.click()
    toast.success('첫번째 이미지 다운로드 완료')
  }

  getData = async () => {
    /*
    change: 1536139202
    created_at: "Sat Jun 02 10:34:31 -0500 2018"
    directory: "a7/07"
    file_url: "https://simg3.gelbooru.com/images/a7/07/a707c39ad376480613cc5fe37c9d3017.png"
    hash: "a707c39ad376480613cc5fe37c9d3017"
    height: 5705
    id: 4266163
    image: "a707c39ad376480613cc5fe37c9d3017.png"
    owner: "danbooru"
    parent_id: null
    rating: "q"
    sample: true
    sample_height: 1173
    sample_width: 850
    score: 23
    source: "https://files.yande.re/image/a707c39ad376480613cc5fe37c9d3017/yande.re%20456201%20asuna_%28sword_art_online%29%20cait%20naked%20nipples%20sword_art_online.png"
    tags: "1girl absurdres asuna_(sao) bangs blurry blush braid breasts brown_eyes brown_hair cait classroom collarbone depth_of_field desk hair_over_breasts highres indoors large_breasts long_hair looking_at_viewer navel nipples nude paid_reward parted_bangs parted_lips patreon_reward sidelocks solo sword_art_online thigh_gap"
    width: 4134
    */
    const { page, tags } = this.state
    const proxy = 'https://cors-anywhere.herokuapp.com/'
    const url = `https://gelbooru.com/index.php?page=dapi&s=post&q=index&pid=${page}&tags=${tags}&limit=1&json=1`
    this.setState({
      loading: true
    }, async () => {
      const response = await axios.get(proxy + url)
      if (response.status !== 200) return toast.error('해당 검색어는 존재하지 않습니다.')
      const data = response.data
      data.map(i => {
        const post = []
        post.created = i.created_at
        post.directory = i.directory
        post.image = i.image
        this.setState({
          posts: [
            ...this.state.posts,
            post
          ]
        }, () => {
          setTimeout(() => {
            this.setState({ loading: false })
          }, 10000)
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
            value={this.state.tags}
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
                  href={`https://simg3.gelbooru.com/images/${item.directory}/${item.image}`}
                >
                  <img
                    src={`https://simg3.gelbooru.com/images/${item.directory}/${item.image}`}
                    style={{ width: '20px', marginBottom: '5px' }}
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
        <Button
          color='primary'
          onClick={this.download}
        >
          테스트
        </Button>
        <ToastContainer
          position='top-center'
          autoClose={2000}
        />
      </div>
    )
  }
}

export default App