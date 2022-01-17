use cfg_if::cfg_if;

// because tokio doesn't fully support wasm we have to use two different implementations for these locks
cfg_if! {
  if #[cfg(feature = "rt-tokio")] {
    use tokio::sync::{RwLock, RwLockReadGuard, RwLockWriteGuard};
  } else {
    use std::sync::{RwLock, RwLockReadGuard, RwLockWriteGuard};
  }
}

pub struct RwLockWrapper<T: ?Sized> {
  inner: RwLock<T>,
}

impl<T> RwLockWrapper<T> {
  pub fn new(inner: T) -> RwLockWrapper<T> {
    RwLockWrapper {
      inner: RwLock::new(inner),
    }
  }

  #[inline(always)]
  pub async fn write(&self) -> RwLockWriteGuard<'_, T> {
    cfg_if! {
        if #[cfg(feature = "rt-tokio")] {
        self.inner.write().await
      } else {
        self.inner.write().expect("failed to get write lock")
      }
    }
  }

  #[inline(always)]
  pub async fn read(&self) -> RwLockReadGuard<'_, T> {
    cfg_if! {
        if #[cfg(feature = "rt-tokio")] {
        self.inner.read().await
      } else {
        self.inner.read().expect("failed to get read lock")
      }
    }
  }
}
