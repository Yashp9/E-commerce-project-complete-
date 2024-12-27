import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import toast from "react-hot-toast";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

const CreateProductForm = () => {
    const {loading,createProducts} = useProductStore();

    const [newProduct,setNewProduct] = useState({
        name:"",
        description:"",
        price:"",
        category:"",
        image:"",
    });

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
        console.log("inside the creat products")
        await createProducts(newProduct);
        setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
        toast.success("Product addedd")
        } catch (error) {
            console.log("error creating a product");
        }
    }

    const handleImageChange = (e) => {
    try {
        // Access the first file from the input
        const file = e.target.files[0];
        
        // Reset the file input value to ensure the same file can be uploaded again
        e.target.value = "";

        // Check if a file is selected
        if (file) {
            const reader = new FileReader();

            // Define what happens when file reading is complete
            reader.onloadend = () => {
                // Update the state with the image data (Base64 string)
                setNewProduct((prevState) => ({
                    ...prevState,
                    image: reader.result,
                }));
            };

            // Start reading the file as a Base64-encoded string
            reader.readAsDataURL(file);
        }
    } catch (error) {
        console.log("Error uploading the image: ", error.message);
    }
};


  return (
    <motion.div
                className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Product Name
					</label>
                    <input 
                    type="text"
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={(e)=> setNewProduct({...newProduct,name:e.target.value})}
                    className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
                    required
                    />
                    </div>

                    <div>
                        <label htmlFor='description' className='block text-sm font-medium text-gray-300'>
						Description
					</label>
                    <textarea 
                    id="description"
                    name="description"
                    value={newProduct.description}
                    onChange={(e)=> setNewProduct({...newProduct,description:e.target.value})}
                    rows="3"
                    className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500'
                    required
                    />
                    </div>

                    <div>
                        <label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						Price
					</label>
                    <input 
                    type="number"
                    id="price"
                    name="price"
                    value={newProduct.price}
                    onChange={(e)=> setNewProduct({...newProduct,price:e.target.value})}
                    step="0.05"
                    className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
						required
                     />
                    </div>

                    <div>
                        <label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Category
					</label>
                    <select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required
					>
                        <option value="">Select a category</option>
                        {categories.map((category)=>(
                            <option key={categories} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    </div>

                    <div>
                        <input
                        type="file"
                        id="image"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                         />
                         <label
						htmlFor='image'
						className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
					>
                        <Upload className='h-5 w-5 inline-block mr-2' />
                        Upload Image
                    </label>
                    {newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>}
                    </div>

                    <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                    shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                            Loading...
                        </>
                    ) : (
                        <>
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Create Product
                        </>
                    )}
                </button>
                   
                </form>

    </motion.div>
  )
}

export default CreateProductForm













// T-Shirts:

// Classic Black Tee: A timeless black t-shirt with a soft cotton feel and a perfect slim fit for any occasion.
// White Essential Tee: Crisp white t-shirt, breathable fabric, ideal for a clean and minimal everyday look.
// White Graphic Tee: Stylish white t-shirt featuring a subtle print, combining comfort and casual style effortlessly.
// Suits:

// Black Formal Suit: Elegant black suit tailored to perfection, designed for a sharp and polished look at any formal event.
// Gray Modern Suit: A versatile gray suit with a contemporary fit, ideal for office wear or semi-formal occasions.
// Spectacles:

// Cool Trendy Spectacles: Lightweight frames with a sleek design, adding a modern and fashionable edge to your style.
// Blue Ray Filter Glasses: Protect your eyes with these stylish spectacles featuring a blue light filter for screen-heavy days.
// Vintage Round Frames: Classic brown-toned frames offering a retro-inspired look for both style and function.
// Bag:

// Brown Leather Bag:  