import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Peer from 'peerjs';

import LazyLoading from '../../common/components/LazyLoading'
import { actions as exampleActions } from '../../redux/modules/example'
import { exampleSelector } from '../../redux/selectors/exampleSelector'
import { ExampleWithError } from '../../common/components/Example';
import { ErrorBoundary } from '../../common/components/Utilities';
import {Login} from '../../common/components/Login'
import {Users} from '../../common/components/Users'

class MainView extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      loginText: '',
      peer: null,
      peerId: null,
      users: [],
      localStream: null,
      remoteStream: null    
    };

    this.login.bind(this);
    this.setLoginState.bind(this);
    this.setLocalStream.bind(this);
    this.setRemoteStream.bind(this);
    this.callButton.bind(this);
  }

  componentDidMount() {
    this.init()
  }

  init(){

  }

  setLoginState(state, text){
    switch(state){
      case 1:
        this.setState({
          loginText: 'Создание пира...'
        });
        break;
      case 2:
        this.setState({
          loginText: 'Создание вебсокета...'
        });
        break;
      case 3:
        this.setState({
          loginText: ''
        });
        break;
      case 'error':
        this.setState({
          loginText: text
        });
        break;
    }
  }

  setLocalStream(localStream){
    this.setState({
      localStream: localStream
    });
  }

  setRemoteStream(remoteStream){
    this.setState({
      remoteStream: remoteStream
    });
  }

  login = (login) => {

    this.setLoginState(1) // Создание пира

    let peer = new Peer(login, {
      host: 'rocky-river-23153.herokuapp.com',
      port: '',
      path: '/peer-server'
    })

    this.setState({
      peer: peer
    });

    peer.on('error', (err) => {
      this.setLoginState('error', err.message)
    });

    peer.on('open', (id) => {
      console.log('My peer ID:' + id)

      this.setState({
        peerId: id
      });

      this.setLoginState(2) // Создание вебсокета

      const wsAdress = "wss://salty-tundra-03319.herokuapp.com";
      const connection = new WebSocket(wsAdress);

      connection.onopen = () => {

        console.log('Connection is open')

        this.setState({
          isLoggedIn: true
        });

        const data = {
          type: 'new_user',
          data: {
            id: id
          }
        }

        connection.send(JSON.stringify(data));
      };

      connection.onerror = (error) => {
        const textError = `Не удалось подключиться к вебсокет серверу`
        console.log(textError)
        this.setLoginState('error', textError)
      };

      connection.onmessage = (message) => {

        try {
          const json = JSON.parse(message.data);

          if (json.type === 'users_online') { 

            const users = json.data
            console.log('Online: ', users)
            
            this.setState({
              users: users
            });

          } else if (json.type === 'message') { // it's a single message
            console.log('Message: ', json.data)
          } else {
            console.log('Hmm..., I\'ve never seen JSON like this:', json);
          }
          
        } catch (e) {
          console.log('Invalid JSON: ', message.data);
          return;
        }

      }

    })

    peer.on('call', call => {

      const remotePeerId = call.peer
      console.log(`вам звонок от ${remotePeerId}`)

      const startCall = async () => {

        const getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;

        const localStream = await getUserMedia({
            video: false,
            audio: true
        })

        this.setLocalStream(localStream)

        call.answer(localStream)
        call.on('stream', remoteStream => {
          //document.querySelector('video#remote').srcObject = remoteStream

          /*
          const elId = 'remote-' + remoteStream.id;
          const el = '<audio controls id="' + elId + '" autoplay></audio>';

          if($('#'+elId).length === 0){
            $('#list-remote').append(el)
            $('#' + elId)[0].srcObject = remoteStream
          }
          */
          this.setRemoteStream(remoteStream)
        })
      }
      startCall()
    })

  }



  callButton = async (peerId) => {
    console.log('звоним '+peerId)

    const { peer } = this.state
  
    try{

      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {

      } else {
        const textError = 'что-то не так с аудио девайсами'
        console.log(textError)
        throw new Error(textError)
      }

      async function getDevices() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices
      }
      const devices = await getDevices()
      console.log('devices: ', devices)

      const getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;

      const localStream = await getUserMedia({
          video: false,
          audio: true
      })

      console.log('localStream', localStream)
      this.setLocalStream(localStream)


      // звоним 
      const call = peer.call(peerId, localStream);
      
      call.on('stream', (remoteStream) => {
        
        /*
        const elId = 'remote-' + remoteStream.id;
        const el = '<audio controls id="' + elId + '" autoplay></audio>';

        if($('#'+elId).length === 0){
          $('.list-remote', '#'+peerId).append(el)
          $('#' + elId)[0].srcObject = remoteStream
        }
        */
        // $('#remote')[0].srcObject = remoteStream
        this.setRemoteStream(remoteStream)

      });

      call.on('close', function() {
        console.log('Звонок окончен')
      });

    } catch(e){
      console.log(e)
    }       
  }


  render() {
    const { isLoggedIn, users, peer, localStream, remoteStream } = this.state

    return (
      <Fragment>
        {isLoggedIn ? <Users users={users} peer={peer} localStream={localStream} remoteStream={remoteStream} callButton={this.callButton} />  : <Login loginButton={this.login} text={this.state.loginText} /> }
        <ErrorBoundary>
          <ExampleWithError {...this.props} />
        </ErrorBoundary>
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  example: exampleSelector(state),
})

const mapDispatchToProps = {
  ...exampleActions,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainView)
