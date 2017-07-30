import axios from 'axios';
import { store } from '../index.js';
import { socket } from './ClinicAction';

const loadingQueueError = (error) => {
  return{
    type: "Load_Queue_Error",
    error
  }
}

const storeQueueInClinic = (queue) => {
  return {
    type: "STORE_NEW_QUEUE_IN_CLINIC",
    queue
  }
}

const storeQueueInUser = (queue) => {
  return {
    type: "STORE_NEW_QUEUE_IN_USER",
    queue
  }
}

const storeQueueInActiveClinic = (queue) => {
  return {
    type: "STORE_NEW_QUEUE_IN_ACTIVE_CLINIC",
    queue
  }
}


const storeQueue = (queue) => {
  return {
    type: "STORE_NEW_QUEUE",
    queue
  }
}

export const submitQueue = (pic, queue) => {
  return (dispatch) => {
    console.log(queue)
    console.log(pic)
    // here pic is a file
    let picQueueToBackend = new FormData();
    picQueueToBackend.append('pic', pic);
    picQueueToBackend.append('status', queue.status || "");
    picQueueToBackend.append('comment', queue.comment);
    picQueueToBackend.append('user_id', queue.user_id);
    picQueueToBackend.append('clinic_id', queue.clinic_id);

    axios.post('/queue/', picQueueToBackend)
    .then( (response) => {
      console.log('response', response.data)
      //here pic is a url from cloudinary
      dispatch(storeQueue(response.data));
      dispatch(storeQueueInClinic(response.data));
      dispatch(storeQueueInUser(response.data));
      dispatch(storeQueueInActiveClinic(response.data));

      socket.emit('latestQueueForAllUser', response.data)
    }).catch( (error) =>{
      dispatch(loadingQueueError(error));
    })
  }
}


socket.on('queueForAllUser', (queue) => {
  store.dispatch(storeQueue(queue));
  store.dispatch(storeQueueInClinic(queue));
  store.dispatch(storeQueueInActiveClinic(queue));
})

const deleteQueueInStore = (queue_id) => {
  return {
    type: 'DELETE_QUEUE',
    queue_id
  }
}

const deleteQueueInUser = (queue_id, user_id) => {
  return {
    type: 'DELETE_QUEUE_IN_USER',
    queue_id,
    user_id
  }
}

const deleteQueueInClinic = (queue_id, clinic_id) => {
  return {
    type: 'DELETE_QUEUE_IN_CLINIC',
    queue_id,
    clinic_id
  }
}

const deleteQueueInActiveClinic = (queue_id) => {
  return {
    type: 'DELETE_QUEUE_IN_CLINIC',
    queue_id
  }
}

export const deleteQueue = (queueToBeDeleted) => {
  return (dispatch) => {
    console.log('info passed to actions for delete queue', queueToBeDeleted)
    socket.emit('delete queue to back end', queueToBeDeleted)
    // socket.on('delete queue done', (queueInfo) => {
    //   dispatch(deleteQueue(queueInfo.queue_id))
    //   dispatch(deleteQueueInUser(queueInfo.queue_id, queueInfo.user_id))
    //   dispatch(deleteQueueInClinic(queueInfo.queue_id, queueInfo.clinic_id))
    //   dispatch(deleteQueueInActiveClinic(queueInfo.queue_id))
    // })
  }
}

socket.on('delete queue done', (queueInfo) => {
  const state = store.getState();
  if(state.user._id === queueInfo.user_id){
    store.dispatch(deleteQueueInUser(queueInfo.queue_id, queueInfo.user_id))
  }
  store.dispatch(deleteQueueInStore(queueInfo.queue_id))
  store.dispatch(deleteQueueInClinic(queueInfo.queue_id, queueInfo.clinic_id))
  store.dispatch(deleteQueueInActiveClinic(queueInfo.queue_id))
})
