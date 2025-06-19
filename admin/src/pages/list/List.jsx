import React, { useEffect, useState } from 'react'
import './list.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl, currency } from '../../App'

export default function List({ token }) {

  const [list, setList] = useState([])
  const fetchList = async () => {

    // const response = await axios.get(`${url}/api/food/list`);
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      console.log(response.data)
      if (response.data.success) {
        setList(response.data.data)
      }
      else {
        toast.error('error')
      }
    } catch (error) {
      console.log(error)
      toast.error('error')
    }




  }
  useEffect(() => {
    fetchList();

  }, [])

  const removeProduct = async (id) => {
    try {
      // const response = await axios.post(`${url}/api/food/remove`,{id: foodId})
      
      const response = await axios.post(backendUrl + '/api/product/remove', {id}, { headers: { token } })
      
      // console.log(productId)
      if (response.data.success) {
        toast.success('product deleted')
        await fetchList();
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }
  return (
    <div className='list add flex-col'>
      <p>All Product List</p>
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>

        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              {/* <img  src={`${url}/images/`+ item.image} alt='' /> */}
              <img src={item.image[0]} alt='' />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price} {currency}</p>
              <p onClick={() => removeProduct(item._id)} className='cursor'>X</p>
            
            </div>
          )
        })}
      </div>

    </div>
  )
}
