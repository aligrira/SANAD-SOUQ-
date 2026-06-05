
import { doc, updateDoc, getDoc, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';

export interface SubscriptionData {
  type: 'free' | 'bronze' | 'vip';
  startDate?: string;
  endDate?: string;
  status: 'active' | 'expired' | 'canceled';
}

// Ensure date is handled in Tunisia Timezone
const getTunisTime = (): Date => {
  return new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Tunis"}));
};

export const calculateEndDate = (startDate: Date, days: number): string => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const updateSubscriptionStatus = async (uid: string, profile: UserProfile) => {
    if (!profile.subscriptionEndDate) return;
    
    const now = getTunisTime();
    const endDate = new Date(profile.subscriptionEndDate);
    
    if (now > endDate && profile.subscription !== 'free') {
        // Expired
        await updateUserSubscription(uid, {
            subscription: 'free',
            subscriptionEndDate: undefined,
            subscriptionStartDate: undefined
        });
    }
};

export const activateSubscription = async (uid: string, type: 'bronze' | 'vip', durationDays: number) => {
    const startDate = getTunisTime();
    const endDate = calculateEndDate(startDate, durationDays);
    
    return await updateUserSubscription(uid, {
        subscription: type,
        subscriptionStartDate: startDate.toISOString(),
        subscriptionEndDate: endDate
    });
};

export const updateUserSubscription = async (
  uid: string,
  data: Partial<UserProfile>
) => {
  try {
    const userRef = doc(db, 'systemUsers', uid);
    await updateDoc(userRef, data as any);
    return { success: true };
  } catch (error) {
    console.error("Error updating subscription:", error);
    return { success: false, error };
  }
};

export const getAllSubscribers = async () => {
    try {
        const usersRef = collection(db, 'systemUsers');
        const q = query(usersRef, where('subscription', 'in', ['bronze', 'vip']));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
    } catch(e) {
        console.error("Error fetching subscribers:", e);
        return [];
    }
}
