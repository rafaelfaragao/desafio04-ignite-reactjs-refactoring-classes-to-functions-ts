import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface DashboardProps {
  foods: FoodType[],
  editingFood: {},
  modalOpen: false,
  editModalOpen: false
}

interface FoodType {
  id: number,
  name: string,
  description: string,
  price: string,
  image: string,
  available: boolean
}

export default function Dashboard<DashboardProps>(){
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodType>();

 
  useEffect(() =>{
    api.get('/foods').then(response => setFoods(response.data))
    console.log(foods)
  },[])

  async function handleAddFood(food: FoodType){
    try {
      const response = await api.post('/foods', {
        ...food,
        avaliable: true
      });

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodType){
    setEditingFood(food)
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood?.id}`,
        {...editingFood, ...food}
      );

      const foodsUpdated = foods.map(f=> 
        f.id !== foodUpdated.data.id ? f: foodUpdated.data
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(foodId:number){
    await api.delete(`/foods/${foodId}`);

    const foodsFiltered = foods.filter(food => food.id !== foodId)

    setFoods(foodsFiltered);
  }

  function toggleModal(){
    setModalOpen(!modalOpen)
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  }

  function handleEditFood(food:FoodType){
    setEditingFood(food);
    setEditModalOpen(true);
  }


  return(
    <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
  );
}