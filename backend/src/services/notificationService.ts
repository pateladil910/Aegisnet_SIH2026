import { AlertItem, HazardType, AlertSeverity } from '../types';
import { config } from '../config';

interface CooldownEntry {
  lastNotified: number;
}

export class NotificationService {
  private cooldownMap: Map<string, CooldownEntry> = new Map();

  public evaluateNotification(alert: AlertItem, nodeLabel: string): {
    channels: string[];
    smsMessageEn: string;
    smsMessageHi: string;
    shouldDispatchSms: boolean;
  } {
    const key = `${alert.nodeId}:${alert.hazardType}`;
    const now = Date.now();
    const cooldownMs = config.smsCooldownMinutes * 60 * 1000;
    const lastEntry = this.cooldownMap.get(key);

    const channels: string[] = ['dashboard:live'];

    // Escalation Tiers:
    // Watch -> dashboard only
    // Warning -> dashboard + push
    // Critical / High -> dashboard + push + SMS
    if (alert.severity === 'warning') {
      channels.push('push:authorities');
    } else if (alert.severity === 'critical' || alert.severity === 'high') {
      channels.push('push:authorities');
      channels.push('sms:emergency_contacts');
      channels.push('lora:downlink_siren_trigger');
    }

    let shouldDispatchSms = false;
    if (channels.includes('sms:emergency_contacts')) {
      if (!lastEntry || now - lastEntry.lastNotified > cooldownMs) {
        shouldDispatchSms = true;
        this.cooldownMap.set(key, { lastNotified: now });
      }
    }

    // Multilingual Templates (English & Hindi)
    const hazardNames: Record<HazardType, { en: string; hi: string }> = {
      flood: { en: 'FLOOD SURGE', hi: 'बाढ़ का खतरा' },
      fire: { en: 'WILDFIRE / HEAT HAZARD', hi: 'आग / अत्यधिक ताप चेतावनी' },
      pollution: { en: 'HAZARDOUS AIR POLLUTION', hi: 'वायु प्रदूषण चेतावनी' }
    };

    const hazardInfo = hazardNames[alert.hazardType] || { en: alert.hazardType, hi: alert.hazardType };
    
    const smsMessageEn = `[AEGISNET ALERT] ${alert.severity.toUpperCase()}: ${hazardInfo.en} detected at ${nodeLabel}. Risk Score: ${alert.riskScore}/100. Area Probability: ${alert.areaProbabilityIndex}%. Immediate action advised.`;
    const smsMessageHi = `[एजिसनेट चेतावनी] ${alert.severity === 'critical' ? 'गंभीर' : 'सतर्कता'}: ${nodeLabel} पर ${hazardInfo.hi} दर्ज किया गया। जोखिम स्कोर: ${alert.riskScore}/100। क्षेत्र संभावना: ${alert.areaProbabilityIndex}%। कृपया सुरक्षा उपाय करें।`;

    return {
      channels,
      smsMessageEn,
      smsMessageHi,
      shouldDispatchSms
    };
  }
}

export const notificationService = new NotificationService();
