
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TradesTable } from '@/components/TradesTable';
import { TradeForm } from '@/components/TradeForm';
import { TradeItemForm } from '@/components/TradeItemForm';
import { Trade, TradeFormData, TradeItem, TradeItemFormData } from '@/types/trade';

export function Trades() {
  const navigate = useNavigate();
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [editingItem, setEditingItem] = useState<TradeItem | null>(null);
  const [selectedTradeId, setSelectedTradeId] = useState<string>('');

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
    console.log('Deleting trade:', tradeId);
  };

  const handleSaveTrade = (data: TradeFormData) => {
    console.log('Saving trade:', data);
    if (editingTrade) {
      console.log('Updating existing trade:', editingTrade.id);
    } else {
      console.log('Creating new trade');
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

  const handleSaveItem = (data: TradeItemFormData) => {
    console.log('Saving trade item:', data);
    if (editingItem) {
      console.log('Updating existing item:', editingItem.id);
    } else {
      console.log('Creating new item');
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
    />
  );
}
