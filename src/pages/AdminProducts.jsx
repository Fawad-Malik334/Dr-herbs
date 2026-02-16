import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, X, ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { listProducts, createProduct, updateProduct, deleteProduct } from '@/api/api';

const categories = [
  { value: 'herbs', label: 'Herbs' },
  { value: 'supplements', label: 'Supplements' },
  { value: 'teas', label: 'Teas' },
  { value: 'oils', label: 'Essential Oils' },
  { value: 'skincare', label: 'Skincare' },
  { value: 'wellness', label: 'Wellness' },
];

const emptyProduct = {
  name: '',
  description: '',
  short_description: '',
  price: '',
  original_price: '',
  category: 'herbs',
  image_url: '',
  images: [],
  stock: '',
  featured: false,
  benefits: [],
  ingredients: '',
};

function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (cmd, arg) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(cmd, false, arg);
    onChange(editorRef.current.innerHTML);
  };

  const insertLink = () => {
    const url = window.prompt('Enter link URL');
    if (!url) return;
    exec('createLink', url);
  };

  const insertImage = () => {
    fileInputRef.current?.click();
  };

  const onPickImage = (file) => {
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error('Image is too large. Please choose an image under 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        toast.error('Failed to read image');
        return;
      }
      exec('insertImage', result);
    };
    reader.onerror = () => toast.error('Failed to read image');
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border-b border-gray-200">
        <Button type="button" variant="outline" size="sm" onClick={() => exec('bold')}>B</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec('italic')}>I</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => exec('underline')}>U</Button>
        <Button type="button" variant="outline" size="sm" onClick={insertLink}>Link</Button>
        <Button type="button" variant="outline" size="sm" onClick={insertImage}>Image</Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            onPickImage(f);
          }}
        />
      </div>
      <div
        ref={editorRef}
        className="min-h-[160px] p-3 focus:outline-none prose max-w-none"
        contentEditable
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
      />
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [benefitInput, setBenefitInput] = useState('');

  const galleryInputRef = useRef(null);

  const handleMainImageUpload = (file) => {
    if (!file) return;

    if (!file.type?.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        toast.error('Failed to read image');
        return;
      }
      setFormData((prev) => ({ ...prev, image_url: result }));
    };
    reader.onerror = () => {
      toast.error('Failed to read image');
    };
    reader.readAsDataURL(file);
  };

  const addGalleryImage = (file) => {
    if (!file) return;

    if (!file.type?.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        toast.error('Failed to read image');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), result],
      }));
    };
    reader.onerror = () => toast.error('Failed to read image');
    reader.readAsDataURL(file);
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const gallery = Array.isArray(formData.images) ? formData.images : [];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const allProducts = await listProducts();
      setProducts(Array.isArray(allProducts) ? allProducts : []);
    } catch (err) {
      toast.error(err?.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData(emptyProduct);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      price: product.price?.toString() || '',
      original_price: product.original_price?.toString() || '',
      stock: product.stock?.toString() || '',
      images: Array.isArray(product.images) ? product.images : [],
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData(emptyProduct);
    setBenefitInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      stock: parseInt(formData.stock) || 0,
      rating: formData.rating || 4.5,
      review_count: formData.review_count || 0,
    };

    try {
      setIsLoading(true);
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast.success('Product updated successfully!');
      } else {
        await createProduct(data);
        toast.success('Product created successfully!');
      }

      await loadProducts();
      closeDialog();
    } catch (err) {
      toast.error(err?.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        setIsLoading(true);
        await deleteProduct(id);
        toast.success('Product deleted successfully!');
        await loadProducts();
      } catch (err) {
        toast.error(err?.message || 'Failed to delete product');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setFormData({
        ...formData,
        benefits: [...(formData.benefits || []), benefitInput.trim()],
      });
      setBenefitInput('');
    }
  };

  const removeBenefit = (index) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    });
  };

  const filteredProducts = products?.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <AdminLayout title="Products">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openCreateDialog} className="bg-emerald-500 hover:bg-emerald-600 gap-2">
          <Plus className="w-5 h-5" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No products found</p>
          <Button onClick={openCreateDialog} className="mt-4 bg-emerald-500 hover:bg-emerald-600">
            Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-100">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    )}
                    {product.featured && (
                      <Badge className="absolute top-2 left-2 bg-emerald-500">Featured</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-emerald-600 font-bold mb-3">${product.price?.toFixed(2)}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                        className="flex-1"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image URL */}
            <div>
              <Label>Product Image</Label>
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-3">
                <div className="relative w-full aspect-square rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                  <div className="absolute inset-x-2 bottom-2">
                    <Input
                      type="file"
                      accept="image/*"
                      className="h-9 bg-white"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = '';
                        handleMainImageUpload(f);
                      }}
                    />
                  </div>
                </div>

                {gallery.map((img, index) => (
                  <div key={index} className="relative w-full aspect-square rounded-lg bg-gray-100 overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-red-600 flex items-center justify-center"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-full aspect-square rounded-lg border border-dashed border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center"
                  aria-label="Add image"
                >
                  <Plus className="w-6 h-6 text-gray-500" />
                </button>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = '';
                    addGalleryImage(f);
                  }}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="short_description">Short Description</Label>
              <Input
                id="short_description"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Brief description for product cards"
              />
            </div>

            <div>
              <Label htmlFor="description">Full Description</Label>
              <div className="mt-2">
                <RichTextEditor
                  value={formData.description}
                  onChange={(html) => setFormData((prev) => ({ ...prev, description: html }))}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="original_price">Original Price</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  placeholder="For discounts"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
            </div>

            {/* Benefits */}
            <div>
              <Label>Benefits</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  placeholder="Add a benefit"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                />
                <Button type="button" onClick={addBenefit} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.benefits?.map((benefit, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {benefit}
                    <button type="button" onClick={() => removeBenefit(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea
                id="ingredients"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeDialog} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}