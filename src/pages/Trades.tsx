
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TradesTable } from '@/components/TradesTable';
import { TradeForm } from '@/components/TradeForm';
import { TradeItemForm } from '@/components/TradeItemForm';
import { Trade, TradeFormData, TradeItem, TradeItemFormData } from '@/types/trade';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

export function Trades() {
  const navigate = useNavigate();
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [editingItem, setEditingItem] = useState<TradeItem | null>(null);
  const [selectedTradeId, setSelectedTradeId] = useState<string>('');
  
  const { addTrade, updateTrade, deleteTrade, addTradeItem, updateTradeItem, deleteTradeItem } = useData();
  const { toast } = useToast();

  const handleCreateNewTrade = () => {
    setEditingTrade(null);
    setShowTradeForm(true);
  };

  const handleViewDetail = (tradeId: string) => {
    navigate(`/trades/${tradeId}`);
  };

  const handleEditTrade = (trade: Trade) => {
    setEditingTrade(trade);
    setShowTradeForm(true);
  };

  const handleDeleteTrade = (tradeId: string) => {
    deleteTrade(tradeId);
    toast({
      title: "Trade deleted",
      description: "The trade has been removed successfully."
    });
  };

  const handleSaveTrade = (data: TradeFormData) => {
    if (editingTrade) {
      updateTrade(editingTrade.id, data);
      toast({
        title: "Trade updated",
        description: "The trade has been updated successfully."
      });
    } else {
      addTrade(data);
      toast({
        title: "Trade created",
        description: "A new trade has been created successfully."
      });
    }
    setShowTradeForm(false);
    setEditingTrade(null);
  };

  const handleCancelTrade = () => {
    setShowTradeForm(false);
    setEditingTrade(null);
  };

  const handleAddItem = (tradeId: string) => {
    setSelectedTradeId(tradeId);
    setEditingItem(null);
    setShowItemForm(true);
  };

  const handleEditItem = (item: TradeItem) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleDeleteItem = (itemId: string) => {
    deleteTradeItem(itemId);
    toast({
      title: "Trade item deleted",
      description: "The trade item has been removed successfully."
    });
  };

  const handleSaveItem = (data: TradeItemFormData) => {
    if (editingItem) {
      updateTradeItem(editingItem.id, data);
      toast({
        title: "Trade item updated",
        description: "The trade item has been updated successfully."
      });
    } else {
      addTradeItem(data);
      toast({
        title: "Trade item created",
        description: "A new trade item has been created successfully."
      });
    }
    setShowItemForm(false);
    setEditingItem(null);
    setSelectedTradeId('');
  };

  const handleCancelItem = () => {
    setShowItemForm(false);
    setEditingItem(null);
    setSelectedTradeId('');
  };

  if (showTradeForm) {
    return (
      <TradeForm
        trade={editingTrade}
        onSubmit={handleSaveTrade}
        onCancel={handleCancelTrade}
      />
    );
  }

  if (showItemForm) {
    return (
      <TradeItemForm
        item={editingItem}
        tradeId={selectedTradeId}
        onSubmit={handleSaveItem}
        onCancel={handleCancelItem}
      />
    );
  }

  return (
    <TradesTable 
      onCreateNew={handleCreateNewTrade}
      onViewDetail={handleViewDetail}
      onEdit={handleEditTrade}
      onDelete={handleDeleteTrade}
      onAddItem={handleAddItem}
      onEditItem={handleEditItem}
      onDeleteItem={handleDeleteItem}
    />
  );
}
