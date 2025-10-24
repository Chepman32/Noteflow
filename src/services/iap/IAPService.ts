/**
 * In-App Purchase Service
 * Handles premium subscriptions and purchases
 */

import {Platform} from 'react-native';
import * as RNIap from 'react-native-iap';

export enum IAPProduct {
  PremiumMonthly = 'noteflow_premium_monthly',
  PremiumYearly = 'noteflow_premium_yearly',
  PremiumLifetime = 'noteflow_premium_lifetime',
}

export interface PurchaseResult {
  success: boolean;
  productId?: string;
  error?: string;
}

export class IAPService {
  private static products: RNIap.Product[] = [];
  private static isInitialized = false;

  /**
   * Initialize IAP
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await RNIap.initConnection();

      const productIds = [
        IAPProduct.PremiumMonthly,
        IAPProduct.PremiumYearly,
        IAPProduct.PremiumLifetime,
      ];

      if (Platform.OS === 'ios') {
        this.products = await RNIap.getProducts({skus: productIds});
      }

      this.isInitialized = true;

      // Listen for purchases
      this.setupPurchaseListener();
    } catch (error) {
      console.error('IAP initialization error:', error);
      throw error;
    }
  }

  /**
   * Get available products
   */
  static async getProducts(): Promise<RNIap.Product[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.products;
  }

  /**
   * Purchase product
   */
  static async purchaseProduct(productId: IAPProduct): Promise<PurchaseResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const purchase = await RNIap.requestPurchase({sku: productId});

      // Verify receipt with server (would implement actual verification)
      const verified = await this.verifyReceipt(purchase);

      if (verified) {
        // Unlock premium features
        await this.unlockPremium();

        // Finish transaction
        await RNIap.finishTransaction({purchase});

        return {
          success: true,
          productId,
        };
      }

      return {
        success: false,
        error: 'Receipt verification failed',
      };
    } catch (error: any) {
      console.error('Purchase error:', error);

      return {
        success: false,
        error: error.message || 'Purchase failed',
      };
    }
  }

  /**
   * Restore purchases
   */
  static async restorePurchases(): Promise<boolean> {
    try {
      const purchases = await RNIap.getAvailablePurchases();

      if (purchases && purchases.length > 0) {
        // Verify and unlock premium
        await this.unlockPremium();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Restore purchases error:', error);
      return false;
    }
  }

  /**
   * Check if user has premium
   */
  static async hasPremium(): Promise<boolean> {
    const {useSettingsStore} = require('@store/settings');
    const {isPremium} = useSettingsStore.getState();
    return isPremium;
  }

  /**
   * Unlock premium features
   */
  private static async unlockPremium(): Promise<void> {
    const {useSettingsStore} = require('@store/settings');
    useSettingsStore.getState().setIsPremium(true);
  }

  /**
   * Verify receipt (simplified)
   */
  private static async verifyReceipt(purchase: RNIap.Purchase): Promise<boolean> {
    // In production, would send receipt to backend for verification
    console.log('Verifying receipt:', purchase.transactionReceipt);

    // Simplified verification
    return !!purchase.transactionReceipt;
  }

  /**
   * Setup purchase update listener
   */
  private static setupPurchaseListener(): void {
    RNIap.purchaseUpdatedListener((purchase: RNIap.Purchase) => {
      console.log('Purchase updated:', purchase);

      // Handle purchase update
      this.handlePurchaseUpdate(purchase);
    });

    RNIap.purchaseErrorListener((error: RNIap.PurchaseError) => {
      console.error('Purchase error:', error);
    });
  }

  /**
   * Handle purchase update
   */
  private static async handlePurchaseUpdate(purchase: RNIap.Purchase): Promise<void> {
    try {
      const verified = await this.verifyReceipt(purchase);

      if (verified) {
        await this.unlockPremium();
        await RNIap.finishTransaction({purchase});
      }
    } catch (error) {
      console.error('Handle purchase update error:', error);
    }
  }

  /**
   * Cleanup
   */
  static async cleanup(): Promise<void> {
    try {
      await RNIap.endConnection();
      this.isInitialized = false;
    } catch (error) {
      console.error('IAP cleanup error:', error);
    }
  }

  /**
   * Get product price
   */
  static getProductPrice(productId: IAPProduct): string {
    const product = this.products.find((p) => p.productId === productId);
    return product?.localizedPrice || '';
  }
}
